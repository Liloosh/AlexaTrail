namespace backend.Model.Domain
{
    public class Ref
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public string Type { get; set; }
        public int Order { get; set; }
        public string URL { get; set; }
        public bool? DoubleRef { get; set; }
        public int? OrderInRef { get; set; }
        public Guid RefsGroupId { get; set; }

        public RefsGroup RefsGroup { get; set; }
    }
}
