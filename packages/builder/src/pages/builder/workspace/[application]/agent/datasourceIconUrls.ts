import AirtableIconUrl from "assets/datasource-icons/airtable.svg"
import ArangoDbIconUrl from "assets/datasource-icons/arangodb.svg"
import BudibaseIconUrl from "assets/datasource-icons/budibase.svg"
import CouchDbIconUrl from "assets/datasource-icons/couchdb.svg"
import CustomIconUrl from "assets/datasource-icons/custom.svg"
import DynamoDbIconUrl from "assets/datasource-icons/dynamodb.svg"
import ElasticsearchIconUrl from "assets/datasource-icons/elasticsearch.svg"
import FirestoreIconUrl from "assets/datasource-icons/firestore.svg"
import GoogleSheetsIconUrl from "assets/datasource-icons/google_sheets.svg"
import MongoDbIconUrl from "assets/datasource-icons/mongodb.svg"
import MysqlIconUrl from "assets/datasource-icons/mysql.svg"
import PostgresIconUrl from "assets/datasource-icons/postgres.svg"
import RedisIconUrl from "assets/datasource-icons/redis.svg"
import S3IconUrl from "assets/datasource-icons/s3.svg"
import SnowflakeIconUrl from "assets/datasource-icons/snowflake.svg"
import SqlServerIconUrl from "assets/datasource-icons/sql_server.svg"
import OracleIconUrl from "assets/oracle.png"
import { REST_TAG_ICON_URL } from "./logos/tagIconUrls"

// Code editor binding tags render icons via <img src="...">, so we need real URLs.
export const DATASOURCE_TAG_ICON_URLS: Record<string, string> = {
  AIRTABLE: AirtableIconUrl,
  ARANGODB: ArangoDbIconUrl,
  BUDIBASE: BudibaseIconUrl,
  COUCHDB: CouchDbIconUrl,
  CUSTOM: CustomIconUrl,
  DYNAMODB: DynamoDbIconUrl,
  ELASTICSEARCH: ElasticsearchIconUrl,
  FIRESTORE: FirestoreIconUrl,
  GOOGLE_SHEETS: GoogleSheetsIconUrl,
  MONGODB: MongoDbIconUrl,
  MYSQL: MysqlIconUrl,
  ORACLE: OracleIconUrl,
  POSTGRES: PostgresIconUrl,
  REDIS: RedisIconUrl,
  S3: S3IconUrl,
  SNOWFLAKE: SnowflakeIconUrl,
  SQL_SERVER: SqlServerIconUrl,
  REST: REST_TAG_ICON_URL,
}