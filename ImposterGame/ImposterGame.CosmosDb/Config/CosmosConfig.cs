namespace ImposterGame.CosmosDb.Config
{
    public class CosmosConfig
    {
        public string ConnectionString { get; set; }

        public string TableName { get; set; }

        // Not used

        public string EndpointUrl { get; set; }

        public string PrimaryKey { get; set; }

        public string DatabaseId { get; set; }

        public string ContainerId { get; set; }
    }
}
