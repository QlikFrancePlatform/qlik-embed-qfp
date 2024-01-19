require('dotenv').config({ path: '../../.env' });
const tenantUrl = process.env.TENANT_URL;
const appId = process.env.APP_ID;
const webIntegrationId = process.env.WEB_INTEGRATION_ID;
const headers = {
  'accept-language': 'en',
  'Content-Type': 'application/json',
  'qlik-web-integration-id': webIntegrationId
}; // headers to pass in requests

import charts from './charts';

import ConnectService from './connect';
import EngineService from './engine';

const connectService = new ConnectService();

export default class AdvisorService {

    constructor() { console.log('constructor . .. '); }

    /**
     * Search recommandation Advisor
     */

    async fetchRecommendationAndRenderChart(requestPayload) {
        // fetch recommendations for text or metadata
        const recommendations = await this.getRecommendation(requestPayload);
        console.log('recommendations received');

        const engineUrl = `${tenantUrl.replace('https', 'wss')}/app/${appId}`;
        // fetch rec options which has hypercubeDef
        const recommendation = recommendations.data.recAnalyses[0];
        // get csrf token
        const qcsHeaders = await connectService.getQCSHeaders();
        const engineService = new EngineService(engineUrl);
        // get openDoc handle
        const app = await engineService.getOpenDoc(appId, qcsHeaders);
        await this.renderHypercubeDef(app, recommendation);
    }

    /**
     * Display recommandation Advisor on the webpage
     */

    async renderHypercubeDef(app, recommendation) {
        const type = recommendation.chartType;
        console.log(type)

        const nebbie = charts.embed(app, {
        types: [
            {
            name: type,
            load: async () => charts[type],
            },
        ],
        });

        document.querySelector('.toolbar').innerHTML = '';
        (await nebbie.selections()).mount(document.querySelector('.toolbar'));

        await nebbie.render({
          type: type,
          element: document.getElementById('chart-advisor'),
          extendProperties: true,
          properties: { ...recommendation.options },
          // fields: ["Month", "=sum(Sales)"],
        });
    }

    /**
     * rest api call for analyses
     */
    async getAnalyses() {
      await connectService.qlikLogin(); // make sure you are logged in to your tenant
      // build url to execute analyses call
      const endpointUrl = `${tenantUrl}/api/v1/apps/${appId}/insight-analyses`;
      const response = await fetch(endpointUrl, {
        credentials: "include",
        mode: "cors",
        method: 'GET',
        headers,
      });

      const analysesResponse = await response.json();
      return analysesResponse;
    }

    /**
     * rest api call for classifications
     */
    async getClassifications() {
      await connectService.qlikLogin(); // make sure you are logged in to your tenant
      // build url to execute classification call
      const endpointUrl = `${tenantUrl}/api/v1/apps/${appId}/insight-analyses/model`;
      const response = await fetch(endpointUrl, {
        credentials: "include",
        mode: "cors",
        method: 'GET',
        headers,
      });

      const classificationResponse = await response.json();
      return classificationResponse;
    }


    /**
     * rest api call for recommendations
     */
    async getRecommendation(requestPayload) {
        await connectService.qlikLogin(); // make sure you are logged in to your tenant
        const qcsHeaders = await connectService.getQCSHeaders();
        headers["qlik-csrf-token"] = qcsHeaders["qlik-csrf-token"];
        // build url to execute recommendation call
        const endpointUrl = `${tenantUrl}/api/v1/apps/${appId}/insight-analyses/actions/recommend`;
        let data = {};
        // generate request payload
        if (requestPayload.text) {
          data = JSON.stringify({
              text: requestPayload.text
          });
        } else if (requestPayload.fields || requestPayload.libItems) {
          data = JSON.stringify({
            fields: requestPayload.fields,
            libItems: requestPayload.libItems,
            targetAnalysis: { id: requestPayload.id },
          });
        }

        const response = await fetch(endpointUrl, {
          credentials: "include",
          mode: "cors",
          method: 'POST',
          headers,
          body: data,
        });

        const recommendationResponse = await response.json();
        return recommendationResponse;
    }

}
