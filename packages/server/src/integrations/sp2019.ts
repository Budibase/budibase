import { JsomNode } from 'sp-jsom-node';

interface sp2019Config {
  siteUrl: string
  username: string
  password: string
  domain: string
}


const sp2019 = new JsomNode({
    modules: ['taxonomy', 'userprofiles']
  });

const SCHEMA = {
  // Optional link to docs, which gets shown in the UI.
  docs: "https://github.com/koltyakov/sp-jsom-node",
  plus: true,
  friendlyName: "SharePoint2019",
  description:
      "SharePoint2019 Service to manage sharepoint 2019 on-premise server. ",
  datasource: {
    siteUrl: {
	type: "string",
	default: "http://svrsharepoint4.agglo.local",
	required: true,
    },
    username: {
	type: "string",
	default: "username",
	required: true,
    },
    password: {
	type: "string",
	default: "password",
	required: true,
    },
    domain: {
	type: "string",
	default: "domain",
	required: true,
    },

  },
  query: {},
}

class SP2019Integration {

	private config:sp2019Config
	private client:any

	constructor(config: sp2019Config) {
	  this.config = config
	  this.client = sp2019.init({
    	         siteUrl: config.siteUrl,
    
    	         authOptions: {
      	          username: config.username,
      	          password: config.password,
      		  domain: config.domain
    		 }
  	 	}).getContext();
	}

}

module.exports = {
  schema: SCHEMA,
  integration: SP2019Integration,
}
