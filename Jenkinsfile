/*
 * CI/CD-Pipeline für das Autogrowr-Frontend (Vite/React).
 *
 * VOR DEM ERSTEN LAUF ANPASSEN (3 Stellen):
 *   1. DEPLOY_DIR / COMPOSE_FILE / COMPOSE_SERVICE unten auf die echten
 *      Pfade bzw. den echten Servicenamen des Frontend-Containers im
 *      Server-docker-compose.yml setzen.
 *   2. In Jenkins unter "Manage Jenkins -> Credentials" eine Credential vom
 *      Typ "Secret file" mit der ID "autogrowr-frontend-env" anlegen, die
 *      genau den Inhalt der produktiven .env-Datei enthält (siehe
 *      .env.example im Repo-Root für die benötigten Variablen). Ohne diese
 *      Datei fehlen VITE_STRIPE_PUBLISHABLE_KEY etc. im Build und der Shop
 *      bricht in Produktion.
 *   3. Falls der Standard-Branch bei euch nicht "master" heißt, die
 *      "when { branch 'master' }"-Bedingungen unten anpassen.
 *
 * Node.js ist direkt im Jenkins-Image installiert (siehe ~/jenkins/Dockerfile)
 * statt über das NodeJS-Plugin/tools{}-Block eingebunden — Letzteres löste
 * bei uns eine NullPointerException in der Pipeline-Validierung aus.
 */

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    // TODO: an eure Server-Konfiguration anpassen — siehe Hinweis oben.
    DEPLOY_DIR      = '/srv/autogrowr_shop/autogrowr_neuer_shop'
    COMPOSE_FILE    = '/srv/autogrowr_shop/docker-compose.yml'
    COMPOSE_SERVICE = 'frontend'
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Configure') {
      steps {
        withCredentials([file(credentialsId: 'autogrowr-frontend-env', variable: 'ENV_FILE')]) {
          sh 'cp "$ENV_FILE" .env'
        }
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('E2E: Checkout-Flow') {
      // Läuft bewusst nicht bei jedem Push: jeder Lauf legt eine echte
      // Testbestellung im Medusa-Admin an und verschickt die
      // Owner-Benachrichtigungsmail. Nur auf master bzw. per Zeitplan (siehe
      // separaten "cron"-Trigger, den Jenkins für Multibranch-Jobs anbietet).
      when {
        anyOf {
          branch 'master'
          triggeredBy 'TimerTrigger'
        }
      }
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.63.0-jammy'
          reuseNode true
        }
      }
      environment {
        E2E_BASE_URL = 'https://home.autogrowr.de'
      }
      steps {
        sh 'npm run test:e2e'
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'playwright-report/results.xml'
          archiveArtifacts allowEmptyArchive: true, artifacts: 'playwright-report/**, test-results/**'
        }
      }
    }

    stage('Deploy') {
      when { branch 'master' }
      steps {
        sh """
          rsync -a --delete \
            --exclude '.git' \
            --exclude 'node_modules' \
            --exclude 'e2e' \
            --exclude 'playwright-report' \
            --exclude 'test-results' \
            ./ '${DEPLOY_DIR}/'

          docker compose -f '${COMPOSE_FILE}' build '${COMPOSE_SERVICE}'
          docker compose -f '${COMPOSE_FILE}' up -d '${COMPOSE_SERVICE}'
        """
      }
    }
  }

  post {
    failure {
      echo 'Frontend-Pipeline fehlgeschlagen — Konsolen-Log in Jenkins prüfen.'
    }
  }
}
