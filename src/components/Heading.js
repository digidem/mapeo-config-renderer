export default function Heading() {
  return (
    <header>
      <h2>Comapeo categories viewer</h2>
      <div></div>
      <form
        action="http://localhost:5000/upload/"
        method="POST"
        enctype="multipart/form-data"
      >
        <label for="file">Upload .comapeocat file:</label>
        <input
          type="file"
          id="file"
          name="categories"
          accept=".comapeocat"
          required
        />

        <button type="submit">Upload</button>
      </form>
    </header>
  );
}
