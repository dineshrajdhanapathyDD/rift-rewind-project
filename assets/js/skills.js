/**
 * Skills and Technology Section
 * Dynamic skills display with AWS Community Builder focus
 */

// Skills data with AWS Community Builder emphasis
const skillsData = {
    "AWS & Cloud": {
        icon: "☁️",
        skills: [
            { name: "AWS EC2", level: 9, category: "compute" },
            { name: "AWS S3", level: 9, category: "storage" },
            { name: "AWS Lambda", level: 8, category: "serverless" },
            { name: "AWS VPC", level: 8, category: "networking" },
            { name: "AWS IAM", level: 9, category: "security" },
            { name: "AWS CloudFormation", level: 7, category: "iac" },
            { name: "AWS ECS/EKS", level: 8, category: "containers" }
        ]
    },
    "DevOps & CI/CD": {
        icon: "🔧",
        skills: [
            { name: "Docker", level: 9, category: "containers" },
            { name: "Kubernetes", level: 8, category: "orchestration" },
            { name: "Jenkins", level: 8, category: "cicd" },
            { name: "GitHub Actions", level: 9, category: "cicd" },
            { name: "Terraform", level: 8, category: "iac" },
            { name: "Ansible", level: 7, category: "automation" }
        ]
    },
    "Programming & Scripting": {
        icon: "💻",
        skills: [
            { name: "Python", level: 8, category: "programming" },
            { name: "Bash/Shell", level: 9, category: "scripting" },
            { name: "JavaScript", level: 7, category: "programming" },
            { name: "YAML", level: 9, category: "config" },
            { name: "JSON", level: 9, category: "config" },
            { name: "Git & GitHub", level: 9, category: "tools" },
            { name: "Linux", level: 9, category: "os" },
            { name: "REST APIs", level: 8, category: "programming" }
        ]
    },
    "QA & Testing": {
        icon: "🧪",
        skills: [
            { name: "Selenium", level: 8, category: "testing" },
            { name: "JUnit", level: 8, category: "testing" },
            { name: "Postman", level: 9, category: "testing" },
            { name: "SonarQube", level: 8, category: "quality" },
            { name: "Test Automation", level: 8, category: "testing" }
        ]
    },
    "Monitoring & Security": {
        icon: "🔒",
        skills: [
            { name: "Prometheus", level: 7, category: "monitoring" },
            { name: "Grafana", level: 7, category: "monitoring" },
            { name: "ELK Stack", level: 6, category: "logging" },
            { name: "AWS CloudWatch", level: 8, category: "monitoring" },
            { name: "Security Best Practices", level: 8, category: "security" }
        ]
    }
};

// Initialize skills section
document.addEventListener('DOMContentLoaded', function() {
    initSkillsSection();
});

function initSkillsSection() {
    const skillsContainer = document.getElementById('skills-container');
    if (!skillsContainer) return;

    // Clear existing content
    skillsContainer.innerHTML = '';

    // Create skills categories
    Object.entries(skillsData).forEach(([categoryName, categoryData], index) => {
        const categoryElement = createSkillCategory(categoryName, categoryData, index);
        skillsContainer.appendChild(categoryElement);
    });

    // Initialize animations
    initSkillAnimations();
}

function createSkillCategory(categoryName, categoryData, index) {
    const category = document.createElement('div');
    category.className = 'skills__category';
    category.style.animationDelay = `${index * 0.1}s`;

    category.innerHTML = `
        <div class="skills__category-header">
            <div class="skills__category-icon">${categoryData.icon}</div>
            <h3 class="skills__category-title">${categoryName}</h3>
        </div>
        <div class="skills__list">
            ${categoryData.skills.map(skill => createSkillItem(skill)).join('')}
        </div>
    `;

    return category;
}

function createSkillItem(skill) {
    const levelText = getLevelText(skill.level);
    const levelPercentage = (skill.level / 10) * 100;

    return `
        <div class="skill__item" data-category="${skill.category}">
            <div class="skill__header">
                <span class="skill__name">${skill.name}</span>
                <span class="skill__level-text">${levelText}</span>
            </div>
            <div class="skill__progress">
                <div class="skill__progress-bar" style="--skill-level: ${levelPercentage}%"></div>
            </div>
        </div>
    `;
}

function getLevelText(level) {
    if (level >= 9) return 'Expert';
    if (level >= 8) return 'Advanced';
    if (level >= 7) return 'Proficient';
    if (level >= 6) return 'Intermediate';
    return 'Beginner';
}

function initSkillAnimations() {
    // Intersection Observer for skill animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillCategory(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.skills__category').forEach(category => {
            observer.observe(category);
        });
    }
}

function animateSkillCategory(category) {
    const skillItems = category.querySelectorAll('.skill__item');
    
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('skill__item--animated');
            
            const progressBar = item.querySelector('.skill__progress-bar');
            if (progressBar) {
                progressBar.classList.add('skill__progress-bar--animated');
            }
        }, index * 100);
    });
}

// AWS Community Builder specific enhancements
function highlightAWSSkills() {
    const awsSkills = document.querySelectorAll('.skill__item[data-category*="aws"], .skill__item .skill__name');
    
    awsSkills.forEach(skill => {
        const skillName = skill.textContent || skill.querySelector('.skill__name')?.textContent;
        if (skillName && skillName.toLowerCase().includes('aws')) {
            skill.classList.add('skill--aws-highlighted');
        }
    });
}

// Initialize AWS highlighting after skills load
setTimeout(highlightAWSSkills, 500);