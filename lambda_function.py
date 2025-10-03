import json
import boto3
import urllib3
from urllib.parse import quote

def lambda_handler(event, context):
    """
    Fetches champion mastery data for a summoner using Riot ID.
    Expected input: {"summonerName": "GameName#TAG", "region": "na1"}
    """
    try:
        # Parse the request
        body = json.loads(event['body'])
        summoner_name = body.get('summonerName', '').strip()
        region = body.get('region', 'na1')
        
        # Validate input
        if not summoner_name:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Summoner name is required'})
            }
        
        # Validate Riot ID format
        if '#' not in summoner_name:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Please use Riot ID format: GameName#TAG (e.g., Hide on bush#KR1)'})
            }
        
        # Get API key from Parameter Store
        ssm = boto3.client('ssm')
        parameter = ssm.get_parameter(
            Name='/rift-rewind/riot-api-key',
            WithDecryption=True
        )
        api_key = parameter['Parameter']['Value']
        
        # Initialize HTTP client
        http = urllib3.PoolManager()
        headers = {'X-Riot-Token': api_key}
        
        # Step 1: Get account PUUID using Riot ID
        game_name, tag_line = summoner_name.split('#', 1)
        game_name = quote(game_name)
        tag_line = quote(tag_line)
        
        routing_value = get_routing_value(region)
        account_url = f"https://{routing_value}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
        
        account_response = http.request('GET', account_url, headers=headers)
        
        if account_response.status == 404:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Riot ID not found. Check spelling and region.'})
            }
        elif account_response.status != 200:
            return {
                'statusCode': account_response.status,
                'body': json.dumps({'error': f'Failed to fetch account: {account_response.status}'})
            }
        
        account_data = json.loads(account_response.data.decode('utf-8'))
        puuid = account_data['puuid']
        
        # Step 2: Get summoner data by PUUID
        summoner_url = f"https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}"
        summoner_response = http.request('GET', summoner_url, headers=headers)
        
        if summoner_response.status != 200:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Failed to fetch summoner data'})
            }
        
        summoner_data = json.loads(summoner_response.data.decode('utf-8'))
        
        # Step 3: Get champion mastery data
        mastery_url = f"https://{region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}/top?count=3"
        mastery_response = http.request('GET', mastery_url, headers=headers)
        
        mastery_data = []
        if mastery_response.status == 200:
            mastery_data = json.loads(mastery_response.data.decode('utf-8'))
        
        # Format response
        response_data = {
            'summoner': {
                'name': account_data['gameName'] + '#' + account_data['tagLine'],
                'level': summoner_data['summonerLevel'],
                'puuid': puuid
            },
            'topChampions': mastery_data[:3]
        }
        
        return {
            'statusCode': 200,
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }

def get_routing_value(region):
    """Map platform region to routing value for Riot ID API"""
    routing_map = {
        'na1': 'americas',
        'br1': 'americas',
        'la1': 'americas',
        'la2': 'americas',
        'euw1': 'europe',
        'eun1': 'europe',
        'tr1': 'europe',
        'ru': 'europe',
        'kr': 'asia',
        'jp1': 'asia',
        'oc1': 'sea',
        'ph2': 'sea',
        'sg2': 'sea',
        'th2': 'sea',
        'tw2': 'sea',
        'vn2': 'sea'
    }
    return routing_map.get(region, 'americas')
