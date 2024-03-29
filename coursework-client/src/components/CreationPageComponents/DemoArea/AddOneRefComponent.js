const AddOneRefComponent = (props) => {
  return (
    <div
      onClick={props.onClick}
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
      className=" h-[7rem] w-[10rem] max-tablet:h-fit max-tablet:py-1 bg-gray-400 opacity-50 rounded-lg flex justify-center items-center"
    >
      <h1 className=" text-5xl">+</h1>
    </div>
  );
};

export default AddOneRefComponent;
