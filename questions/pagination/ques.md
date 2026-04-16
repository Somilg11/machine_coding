## pagination in react [Type - Medium]

```
// App.js
import { useEffect, useState } from "react";
import "./styles.css";

const ProductCard = ({ image, title, description, price, rating }) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-img" />
      <div className="product-left">
        <h3>{title}</h3>
        <h6>{description}</h6>
      </div>
      <div className="product-right">
        <h2>${price}</h2>
        <span className="rating">{rating} #</span>
      </div>
    </div>
  );
};

const PAGE_SIZE = 10;

export default function App() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchData = async () => {
    const data = await fetch("https://dummyjson.com/products");
    const json = await data.json();
    setProducts(json.products);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalProducts = products.length;
  const noOfPages = Math.ceil(totalProducts / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const handlePageChange = (n) => {
    setCurrentPage(n);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };
  return !products.length ? (
    <h1>Oops! No product found</h1>
  ) : (
    <div className="App">
      <h1>Pagination</h1>
      <div className="pagination-container">
        <button
          disabled={currentPage === 0}
          className="page-number"
          onClick={() => goToPreviousPage()}
        >
          ⬅️
        </button>
        {[...Array(noOfPages).keys()].map((n) => (
          <button
            className={"page-number " + (n === currentPage ? "active" : "")}
            key={n}
            onClick={() => handlePageChange(n)}
          >
            {n}
          </button>
        ))}
        <button
          disabled={currentPage === noOfPages - 1}
          className="page-number"
          onClick={() => goToNextPage()}
        >
          ➡️
        </button>
      </div>
      <div>
        {products.slice(start, end).map((p) => (
          <ProductCard
            key={p.id}
            image={p.thumbnail}
            title={p.title}
            description={p.description}
            price={p.price}
            rating={p.rating}
          />
        ))}
      </div>
    </div>
  );
}


```


```
// styles.css
.App {
  font-family: sans-serif;
  text-align: center;
}

.product-card {
  display: flex;
  border: solid 1px;
  margin: 4px;
  padding: 4px;
}

.product-left {
  padding: 2px;
  align-items: start;
  justify-content: left;
}

.product-right {
  padding: 2px;
  align-items: start;
  justify-content: left;
}

.product-img {
  width: 100px;
}

.rating {
  border: dotted;
  padding: 2px;
  border-radius: 10px;
}

.page-number {
  padding: 10px;
  margin: 2px;
  border: solid 1px;
  cursor: pointer;
}

.pagination-container {
  padding: 20px;
}

.active {
  background-color: gold;
}

```