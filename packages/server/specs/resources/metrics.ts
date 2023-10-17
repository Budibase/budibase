import Resource from "./utils/Resource"

const metricsResponse =
  "# HELP budibase_os_uptime Time in seconds that the host operating system has been up.\n" +
  "# TYPE budibase_os_uptime counter\n" +
  "budibase_os_uptime 54958\n" +
  "# HELP budibase_os_free_mem Bytes of memory free for usage on the host operating system.\n" +
  "# TYPE budibase_os_free_mem gauge\n" +
  "budibase_os_free_mem 804507648\n" +
  "# HELP budibase_os_total_mem Total bytes of memory on the host operating system.\n" +
  "# TYPE budibase_os_total_mem gauge\n" +
  "budibase_os_total_mem 16742404096\n" +
  "# HELP budibase_os_used_mem Total bytes of memory in use on the host operating system.\n" +
  "# TYPE budibase_os_used_mem gauge\n" +
  "budibase_os_used_mem 15937896448\n" +
  "# HELP budibase_os_load1 Host operating system load average.\n" +
  "# TYPE budibase_os_load1 gauge\n" +
  "budibase_os_load1 1.91\n" +
  "# HELP budibase_os_load5 Host operating system load average.\n" +
  "# TYPE budibase_os_load5 gauge\n" +
  "budibase_os_load5 1.75\n" +
  "# HELP budibase_os_load15 Host operating system load average.\n" +
  "# TYPE budibase_os_load15 gauge\n" +
  "budibase_os_load15 1.56\n" +
  "# HELP budibase_tenant_user_count The number of users created.\n" +
  "# TYPE budibase_tenant_user_count gauge\n" +
  "budibase_tenant_user_count 1\n" +
  "# HELP budibase_tenant_app_count The number of apps created by a user.\n" +
  "# TYPE budibase_tenant_app_count gauge\n" +
  "budibase_tenant_app_count 2\n" +
  "# HELP budibase_tenant_production_app_count The number of apps a user has published.\n" +
  "# TYPE budibase_tenant_production_app_count gauge\n" +
  "budibase_tenant_production_app_count 1\n" +
  "# HELP budibase_tenant_dev_app_count The number of apps a user has unpublished in development.\n" +
  "# TYPE budibase_tenant_dev_app_count gauge\n" +
  "budibase_tenant_dev_app_count 1\n" +
  "# HELP budibase_tenant_db_count The number of couchdb databases including global tables such as _users.\n" +
  "# TYPE budibase_tenant_db_count gauge\n" +
  "budibase_tenant_db_count 3\n" +
  "# HELP budibase_quota_usage_apps The number of apps created.\n" +
  "# TYPE budibase_quota_usage_apps gauge\n" +
  "budibase_quota_usage_apps 1\n" +
  "# HELP budibase_quota_limit_apps The limit on the number of apps that can be created.\n" +
  "# TYPE budibase_quota_limit_apps gauge\n" +
  "budibase_quota_limit_apps 9007199254740991\n" +
  "# HELP budibase_quota_usage_rows The number of database rows used from the quota.\n" +
  "# TYPE budibase_quota_usage_rows gauge\n" +
  "budibase_quota_usage_rows 0\n" +
  "# HELP budibase_quota_limit_rows The limit on the number of rows that can be created.\n" +
  "# TYPE budibase_quota_limit_rows gauge\n" +
  "budibase_quota_limit_rows 9007199254740991\n" +
  "# HELP budibase_quota_usage_plugins The number of plugins in use.\n" +
  "# TYPE budibase_quota_usage_plugins gauge\n" +
  "budibase_quota_usage_plugins 0\n" +
  "# HELP budibase_quota_limit_plugins The limit on the number of plugins that can be created.\n" +
  "# TYPE budibase_quota_limit_plugins gauge\n" +
  "budibase_quota_limit_plugins 9007199254740991\n" +
  "# HELP budibase_quota_usage_user_groups The number of user groups created.\n" +
  "# TYPE budibase_quota_usage_user_groups gauge\n" +
  "budibase_quota_usage_user_groups 0\n" +
  "# HELP budibase_quota_limit_user_groups The limit on the number of user groups that can be created.\n" +
  "# TYPE budibase_quota_limit_user_groups gauge\n" +
  "budibase_quota_limit_user_groups 9007199254740991\n" +
  "# HELP budibase_quota_usage_queries The number of queries used in the current month.\n" +
  "# TYPE budibase_quota_usage_queries gauge\n" +
  "budibase_quota_usage_queries 0\n" +
  "# HELP budibase_quota_limit_queries The limit on the number of queries for the current month.\n" +
  "# TYPE budibase_quota_limit_queries gauge\n" +
  "budibase_quota_limit_queries 9007199254740991\n" +
  "# HELP budibase_quota_usage_automations The number of automations used in the current month.\n" +
  "# TYPE budibase_quota_usage_automations gauge\n" +
  "budibase_quota_usage_automations 0\n" +
  "# HELP budibase_quota_limit_automations The limit on the number of automations that can be created.\n" +
  "# TYPE budibase_quota_limit_automations gauge\n" +
  "budibase_quota_limit_automations 9007199254740991\n"

export default new Resource().setExamples({
  metrics: {
    value: metricsResponse,
  },
})
