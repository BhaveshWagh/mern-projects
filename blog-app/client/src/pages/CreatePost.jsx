import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");

 async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    // we only want send one file not multiple thats why index is 0
    data.set("file", files[0]);

    ev.preventDefault();
    // console.log(files);
    const response = await fetch("http://localhost:8000/post", {
      method: "POST",
      body: data ,
    });
    
  }
  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />

      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
      />
      <button style={{ marginTop: "6px" }}>Create Post</button>
    </form>
  );
};

export default CreatePost;
