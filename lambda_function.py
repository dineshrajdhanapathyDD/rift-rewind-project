import json
import boto3
import urllib3

def lambda_handler(event, context):
    try:
        # Debug: log the event
        print("Event received:", event)

        # Handle both Lambda URL (rawBody) and API Gateway (body)
        body_str = event.get('body') or event.get('rawBody') or "{}"
        body = json.loads(body_str)

        summoner_name = body.get('summonerName', '').strip()
        tagLine = body.get('tagLine', 'NA1').strip()
        region = body.get('region', 'na1')  # default to na1

        # Region mapping
        regDict = {
            "na1":"americas", "la1":"americas", "la2":"americas", "br1":"americas",
            "euw1":"europe", "eun1":"europe", "tr1":"europe",
            "kr":"asia", "oc1":"asia", "ru":"asia", "jp1":"asia"
        }
        regionGen = regDict.get(region, "americas")

        # Validate input
        if not summoner_name:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Summoner name is required"})
            }

        # Get Riot API key from Parameter Store
        ssm = boto3.client('ssm')
        parameter = ssm.get_parameter(Name='/rift-rewind/riot-api-key', WithDecryption=True)
        api_key = parameter['Parameter']['Value']

        # HTTP client
        http = urllib3.PoolManager()

        # Account API: get summoner by Riot ID
        account_url = f"https://{regionGen}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{summoner_name}/{tagLine}"
        headers = {"X-Riot-Token": api_key}
        account_response = http.request("GET", account_url, headers=headers)

        if account_response.status != 200:
            return {
                "statusCode": account_response.status,
                "body": account_response.data.decode("utf-8")
            }

        account_data = json.loads(account_response.data.decode("utf-8"))
        puuid = account_data["puuid"]

        # Champion mastery by PUUID
        mastery_url = f"https://{region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}"
        mastery_response = http.request("GET", mastery_url, headers=headers)

        mastery_data = []
        if mastery_response.status == 200:
            mastery_data = json.loads(mastery_response.data.decode("utf-8"))

        # Prepare response
        response_data = {
            "summoner": {
                "name": account_data["gameName"],
                "puuid": puuid
            },
            "topChampions": mastery_data[:3]  # Top 3 champions
        }

        return {
            "statusCode": 200,
            "body": json.dumps(response_data)
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error"})
        }
