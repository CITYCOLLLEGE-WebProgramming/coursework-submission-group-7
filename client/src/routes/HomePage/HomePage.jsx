
import SearchBar from "../../components/SearchBar/SearchBar";
import "./HomePage.css";
function HomePage() {

  return (
    <main className="homePage">
      <section className="textContainer">
        <div className="wrapper">
          <h1 className="title">Your Dream Home is one click away</h1>
          <SearchBar />
        </div>
      </section>
      <aside className="imgContainer">
        <img src="/bg.png" alt="Background image" />
      </aside>
    </main>
  );
}

export default HomePage;
