resource "azurerm_monitor_action_group" "metric-alert-group" {
    name = "feedibus-alert-group"
    resource_group_name = var.resource-group-name
    short_name = "metricalert"

    email_receiver {
        name = "Leon Schönhoff"
        email_address = "leon.schoenhoffgw@outlook.com"
        use_common_alert_schema = true
    }

    email_receiver {
        name = "Leon BBHT"
        email_address = "leon.schoenhoff@bbht.de"
        use_common_alert_schema = true
    }
}

resource "azurerm_monitor_metric_alert" "cpu-perc-alert" {
    name = "CPU-Percentage-Alert"
    resource_group_name = var.resource-group-name
    scopes = []
    description = "Metric alert will be triggered when CPU percentage is > 80% for > 5 min"

    criteria {
        metric_namespace = []
        metric_name = ""
        aggregation = "Average"
        operator = "GreaterThan"
        threshold = "80"
    }
    action {
        action_group_id = azurerm_monitor_action_group.metric-alert-group.id
    }
}

resource "azurerm_monitor_metric_alert" "ram-perc-alert" {
    name = "RAM-Percentage-Alert"
    resource_group_name = var.resource-group-name
    scopes = []
    description = "Metric alert will be triggered when RAM percentage is > 80% for > 5 min"

    criteria {
        metric_namespace = []
        metric_name = ""
        aggregation = "Average"
        operator = "GreaterThan"
        threshold = "70"
    }
    action {
        action_group_id = azurerm_monitor_action_group.metric-alert-group.id
    }
}