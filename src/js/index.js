import { Auth, AuthType } from "@qlik/sdk";
import enigma from "enigma.js";
import ConnectService from './connect';

import charts from './charts';

import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
// require('dotenv').config({ path: '../../.env' })

const tenantUrl = process.env.TENANT_URL;
const appId = process.env.APP_ID;
const webIntegrationId = process.env.WEB_INTEGRATION_ID;

const config = {
  authType: AuthType.WebIntegration,
  host: tenantUrl,
  webIntegrationId: webIntegrationId,
  autoRedirect: true
};

const auth = new Auth(config);

if (!auth.isAuthenticated()) {
  auth.authenticate();
} else {
  renderChart(tenantUrl, appId)
}

async function renderChart(tenantUrl, appId) {

  const connect = new ConnectService()
  const headers = await connect.getQCSHeaders();
  const schema = await (await fetch('https://unpkg.com/enigma.js/schemas/12.936.0.json')).json();
  // websocket url for Enigma.js
  const wsUrl = `${tenantUrl.replace('https', 'wss')}/app/${appId}`;
  const params = Object.keys(headers)
    .map((key) => `${key}=${headers[key]}`)
    .join("&");
  const session = enigma.create({
    schema,
    createSocket: () => new WebSocket(`${wsUrl}?${params}`),

  });
  //session.on("traffic:sent", (data) => console.log("sent:", data));
  //session.on("traffic:received", (data) => console.log("received:", data));

  let global = await session.open();
  let app = await global.openDoc(appId);

  // create renderer
  const renderer = charts.embed(app, {
    context: {
      theme: "horizon",
      language: 'en-US',
      // constraints: {
      //     active: true, // do not allow interactions
      // }
    },
    types: [
      {
        name: 'barchart',
        load: () => Promise.resolve(charts.barchart),
      }, {
        name: 'action-button',
        load: () => Promise.resolve(charts.actionbutton)
      }, {
        name: 'bullet-chart',
        load: () => Promise.resolve(charts.bulletchart)
      }, {
        name: 'combo-chart',
        load: () => Promise.resolve(charts.combochart),
      }, {
        name: 'kpi',
        load: () => Promise.resolve(charts.kpi),
      }, {
        name: 'line-chart',
        load: () => Promise.resolve(charts.linechart),
      }, {
        name: 'map',
        load: () => Promise.resolve(charts.map),
      }, {
        name: 'piechart',
        load: () => Promise.resolve(charts.piechart),
      }, {
        name: 'sankey',
        load: () => Promise.resolve(charts.sankeychart),
      }, {
        name: 'scatterplot',
        load: () => Promise.resolve(charts.scatterplot),
      }, {
        name: 'table',
        load: () => Promise.resolve(charts.table),
      }, {
        name: 'boxplot',
        load: () => Promise.resolve(charts.boxplot),
      }, {
        name: 'distributionplot',
        load: () => Promise.resolve(charts.distributionplot),
      }, {
        name: 'sn-grid-chart',
        load: () => Promise.resolve(charts.gridchart),
      }, {
        name: 'histogram',
        load: () => Promise.resolve(charts.histogram),
      }, {
        name: 'orgchart',
        load: () => Promise.resolve(charts.orgchart),
      }, {
        name: 'pivot-table',
        load: () => Promise.resolve(charts.pivottable),
      }, {
        name: 'treemap',
        load: () => Promise.resolve(charts.treemap),
      }, {
        name: 'waterfall',
        load: () => Promise.resolve(charts.waterfall),
      }, {
        name: 'funnel-chart',
        load: () => Promise.resolve(charts.funnelchart),
      }, {
        name: 'filterpane',
        load: () => Promise.resolve(charts.filterpane),
      }, {
        name: 'qlik-word-cloud',
        load: () => Promise.resolve(charts.word),
      }, {
        name: 'layout-container',
        load: () => Promise.resolve(charts.layoutcontainer),
      }, {
        name: 'mekko',
        load: () => Promise.resolve(charts.mekkochart),
      }, {
        name: 'qlik-network-chart',
        load: () => Promise.resolve(charts.networkchart),
      }, {
        name: 'shape',
        load: () => Promise.resolve(charts.shape),
      },
    ]
  });

  // renders toolbar
  (await renderer.selections()).mount(document.querySelector('.toolbar'));

  // renders a bar chart
  renderer.render({
    type: 'barchart',
    element: document.querySelector('.bar-chart'),
    fields: ['productname', '=Count(quantity)'],
    properties: {
      title: 'Product Name per Quantity',
    },
  });

  // renders a action-button
  renderer.render({
    type: 'action-button',
    element: document.querySelector('.action-button'),
    properties: {
      actions: [
        {
          actionType: "clearAll",
          softLock: false,
        },
      ],
      style: {
        label: "Clear Selections",
        font: {
          size: 0.7,
          style: {
            italic: true,
          },
        },
        background: {
          color: "Blue",
        },
        border: {
          useBorder: true,
          radius: 0.25,
          width: 0.1,
          color: "DarkRed",
        },
        icon: {},
      },
    },
  });

  // renders a bullet-chart
  renderer.render({
    type: 'bullet-chart',
    element: document.querySelector('.bullet-chart'),
    fields: ['productname', '=Count(quantity)', '=Count(discount)'],
    properties: {
      title: 'Product name per Quantity and Discount',
      orientation: 'horizontal',
      measureAxis: {
        commonRange: true,
        dock: 'near',
      },
    },
  });

  // renders a combo-chart
  renderer.render({
    type: 'combo-chart',
    element: document.querySelector('.combo-chart'),
    fields: ['[customers.country]', '=Count(quantity)', '=Count(city)'],
    properties: {
      title: 'Count quantity by country & by City',
      components: [
        {
          key: 'bar',
          style: {
            strokeWidth: 'large',
            strokeColor: {
              color: '#25A0A8',
            },
          },
        },
        {
          key: 'line',
          style: {
            lineThickness: 3,
            lineCurve: 'monotone',
          },
        },
      ],
      dataPoint: {
        show: true,
      },
      color: {
        auto: false,
        mode: 'primary',
        paletteColor: {
          color: '#be3b03',
        },
      }
    }
  });

  // renders a KPI
  renderer.render({
    type: 'kpi',
    element: document.querySelector('.kpi'),
    fields: ['=Count(quantity)'],
    properties: {
      showTitle: true,
      title: 'Count Quantity',
    }
  });

  // renders a line chart
  renderer.render({
    type: 'line-chart',
    element: document.querySelector('.line-chart'),
    fields: ['productname', '=Count(quantity)'],
    properties: {
      title: 'Product Name per Quantity',
      lineType: "area",
      dataPoint: {
        show: true,
        showLabels: false,
      },
      style: {
        lineThickness: 3,
        lineCurve: 'monotone',
      }
    },
  });

  // renders a map
  renderer.render({
    type: 'map',
    element: document.querySelector('.map'),
    // options: {
    //   configuration: {
    //     serverUrl: 'https://maps.qlikcloud.com',
    //     // serverKey: ... ,
    //   },
    // },
    properties: {
      gaLayers: [
        {
          type: 'AreaLayer',
          qHyperCubeDef: {
            qDimensions: [
              {
                qDef: {
                  qFieldDefs: ["=[customers.country]"],
                },
                qAttributeExpressions: [
                  {
                    qExpression: 'FR',
                    id: 'locationCountry'
                  }
                ],
              },
            ],
            qMeasures: [],
            qInitialDataFetch: [
              {
                qLeft: 0,
                qTop: 0,
                qWidth: 1,
                qHeight: 1,
              },
            ],
          },
          size: {
            radiusMin: 4,
            radiusMax: 12,
          },
          color: {
            mode: 'primary',
            paletteColor: {
              color: '#f8981d',
            },
          },
          isLatLong: true,
          id: 'kmPpy',
        },
      ],
      mapSettings: {
        baseMap: 'pale',
        showScaleBar: true,
      },
    },
  });

  // renders a pie chart
  renderer.render({
    type: 'piechart',
    element: document.querySelector('.pie-chart'),
    fields: ['city', '=Count(quantity)'],
    properties: {
      title: 'Quantity by City',
    },
  });

  // renders a sankey chart
  renderer.render({
    type: 'sankey',
    element: document.querySelector('.sankey-chart'),
    fields: ['categoryname', 'productname', '=Count(quantity)'],
    properties: {
      title: 'Count quantity by Category & Product Name',
      node: {
        padding: 0.2,
        width: 0.3,
      },
      link: {
        opacity: 0.5,
        shadow: false,
        color: 3,
        colorBy: 'custom',
      },
    },
  });

  // renders a Scatter Plot
  renderer.render({
    type: 'scatterplot',
    element: document.querySelector('.scatter-plot'),
    fields: ['productname', '=Count(quantity)', '=Count(discount)'],
    properties: {
      color: { mode: 'byDimension' },
    },
  });

  // renders a Table
  renderer.render({
    type: 'table',
    element: document.querySelector('.table'),
    fields: ['productname', '=Count(quantity)', '=Count(discount)']
  });

  // renders a boxplot
  renderer.render({
    type: 'boxplot',
    element: document.querySelector('.box-plot'),
    fields: ['productname', 'categoryname', '=Count(quantity)']
  });

  // renders a distributionplot
  renderer.render({
    type: 'distributionplot',
    element: document.querySelector('.distribution-plot'),
    fields: ['productname', 'categoryname', '=Count(quantity)']
  });

  // renders a grid-chart
  renderer.render({
    type: 'sn-grid-chart',
    element: document.querySelector('.grid-chart'),
    fields: ['productname', 'categoryname', '=Count(quantity)'],
    properties: {
      title: 'Product name per Quantity',
    },
  });

  // renders a Histogram
  renderer.render({
    type: 'histogram',
    element: document.querySelector('.histogram'),
    fields: ['products.unitprice'],
    properties: {
      title: 'Product By Unit Price',
    },
  });

  // renders a Org Chart
  renderer.render({
    type: 'orgchart',
    element: document.querySelector('.org-chart'),
    fields: ['employees.country', 'employees.region', '=Count(employeeid)'],
    properties: {
      title: 'Hierachy Employees',
    },
  });

  // renders a Pivot Table
  renderer.render({
    type: 'pivot-table',
    element: document.querySelector('.pivot-table'),
    fields: ['customers.country', 'productname', 'employees.country', '=Count(quantity)'],
    properties: {
      title: 'Report Pivot table',
    },
  });

  // renders a TreeMap
  renderer.render({
    type: 'treemap',
    element: document.querySelector('.treemap'),
    fields: ['productname', '=Count(discount)'],
    properties: {
      title: 'Discount by Product name',
      color: { mode: 'byDimension' },
    },
  });

  // renders a waterfall
  renderer.render({
    type: 'waterfall',
    element: document.querySelector('.waterfall'),
    fields: ['=Count(productid)', '=Count(quantity)'],
    properties: {
      title: 'Discount by Product name',
    },
  });

  // renders a funnel-chart
  renderer.render({
    type: 'funnel-chart',
    element: document.querySelector('.funnel-chart'),
    fields: ['customers.country', '=Count(productid)'],
    properties: {
      title: 'Customers by Country',
    },
  });

  // renders a filter-pane
  renderer.render({
    type: 'filterpane',
    element: document.querySelector('.filter-pane'),
    fields: ['productname', 'categoryname', 'city']
  });

  // renders a Word Cloud
  renderer.render({
    type: 'qlik-word-cloud',
    element: document.querySelector('.word-cloud'),
    fields: ['productname', '=Count(quantity)'],
    properties: {
      title: 'Customers by Country',
    },
  });

  // renders a Layout Container
  renderer.render({
    type: 'layout-container',
    element: document.querySelector('.layout-container'),
    properties: {
      title: 'Layout Container',
      objects: ['YbdAPsy', 'wNHF']
    },
  });

  // renders a Mekko
  renderer.render({
    type: 'mekko',
    element: document.querySelector('.mekko-chart'),
    fields: ['categoryname', 'productname', '=Count(quantity)'],
    properties: {
      title: 'Category & Product by Quantity',
      cellColor: {
        mode: "byDimension",
        byDimension: { type: "index", typeValue: 0 },
      },
    },
  });

  // renders a Network Chart
  renderer.render({
    type: 'qlik-network-chart',
    element: document.querySelector('.network-chart'),
    fields: ['[employees.country]', '[employees.region]', 'city'],
    properties: {
      title: 'Network Chart',
    },
  });

  // renders a Shape line
  renderer.render({
    type: 'shape',
    element: document.querySelector('.shape'),
    properties: {
      shape: {
        type: "dash",
        orientation: "vertical",
        style: {
          width: 3,
          color: {
            color: "#ff00ff",
          },
        }
      }
    },
  });
}
