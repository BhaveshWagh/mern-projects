export default function Post() {
    return(
        <div className="post">
        <div className="image">
          <img src="https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg" />
        </div>
        <div className="texts">
          <h2>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </h2>
          <p className="info">
            <a className="author">Dawid Paszko</a>
            <time>2024-10-04 16:45</time>
          </p>
          <p className="summary">
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>
        </div>
      </div>
    )
}