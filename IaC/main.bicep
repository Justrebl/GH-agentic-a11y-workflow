targetScope = 'resourceGroup'

@description('The Azure region for the Static Web App.')
@allowed([
  'westus2'
  'centralus'
  'eastus2'
  'westeurope'
  'eastasia'
])
param location string = 'westeurope'

@description('A unique token used to build resource names. Defaults to a hash of the resource group id.')
param resourceToken string = uniqueString(resourceGroup().id)

@description('Optional name suffix to identify the application.')
param environmentName string = 'album-viewer'

@description('Tags applied to all resources.')
param tags object = {
  'azd-env-name': environmentName
}

resource staticWebApp 'Microsoft.Web/staticSites@2024-04-01' = {
  name: 'swa-${environmentName}-${resourceToken}'
  location: location
  tags: union(tags, {
    'azd-service-name': 'web'
  })
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

output WEB_NAME string = staticWebApp.name
output WEB_URI string = 'https://${staticWebApp.properties.defaultHostname}'
