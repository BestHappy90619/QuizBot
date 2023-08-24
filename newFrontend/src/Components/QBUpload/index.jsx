import { useRef, useState } from "react";

const QBUpload = (props) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  function handleChange(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      if (props.multiple)
        for (let i = 0; i < e.target.files["length"]; i++) {
          setFiles((prevState) => [...prevState, e.target.files[i]]);
        }
      else setFiles([e.target.files[e.target.files["length"] - 1]]);
    }
  }

  function handleSubmitFile() {
    props.onUploadData(files);
    setFiles([]);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (props.multiple)
        for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
          setFiles((prevState) => [...prevState, e.dataTransfer.files[i]]);
        }
      else setFiles([e.dataTransfer.files[e.dataTransfer.files["length"] - 1]]);
    }
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(fileName, idx) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    <form
      className={`${
        dragActive ? "bg-opacity-30" : "bg-opacity-10"
      } my-4 flex h-44 w-full flex-col items-center justify-center rounded-lg border-2 border-dotted border-custom-btn-clr bg-white p-4 text-center text-custom-txt-clr`}
      onDragEnter={handleDragEnter}
      onSubmit={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      <input
        placeholder="fileInput"
        className="hidden"
        ref={inputRef}
        type="file"
        onChange={handleChange}
        accept={props.accept}
        multiple={props.multiple}
      />

      <p>
        Drag & Drop files or{" "}
        <span
          className="cursor-pointer font-bold text-blue-600"
          onClick={openFileExplorer}
        >
          <u>Select files</u>
        </span>{" "}
        to upload
      </p>
      <p className="text-custom-gray">
        {props.accept.map((filetype, index) => {
          if (index === props.accept.length - 1) return "*" + filetype;
          return "*" + filetype + ", ";
        })}
      </p>

      <div className="flex flex-col items-center p-3">
        {files.map((file, idx) => (
          <div key={idx} className="flex flex-row space-x-5">
            <span>{file.name}</span>
            <span
              className="cursor-pointer text-red-500"
              onClick={() => removeFile(file.name, idx)}
            >
              remove
            </span>
          </div>
        ))}
      </div>

      <button
        className="mt-3 w-auto rounded-lg bg-custom-btn-clr p-2"
        onClick={handleSubmitFile}
      >
        <span className="p-2 text-white">Upload</span>
      </button>
    </form>
  );
};

export default QBUpload;
