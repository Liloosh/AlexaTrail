const AddTwoRefComponent = (props) => {
  return (
    <div
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
      className=" h-[7rem] w-[10rem] bg-gray-400 opacity-50 rounded-lg flex justify-evenly items-center"
    >
      <h1 className=" text-5xl">+</h1>
      <h1 className=" text-5xl">+</h1>
    </div>
  );
};

export default AddTwoRefComponent;
