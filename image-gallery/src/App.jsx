import { faker } from "@faker-js/faker";
import { useReducer } from "react";

function generateRandomProductList(count) {
	return Array.from({ length: count }, () => {
		return {
			id: faker.string.uuid(),
			name: faker.commerce.productName(),
			price: faker.commerce.price(),
			picture: faker.image.urlPicsumPhotos(),
		};
	});
}

const gridView = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
	gap: "1rem",
};

const li = {
	listStyle: "none",
};

const image = {
	width: "100%",
	height: "auto",
};

function productReducer(state, action) {
	return state;
}

function lazyInit() {
	return generateRandomProductList(10000);
}

const App = () => {
	const [products, dispatch] = useReducer(productReducer, [], lazyInit);
	return (
		<ul style={gridView}>
			{products.map((product) => (
				<li style={li} key={product.id}>
					<img style={image} src={product.picture} alt={product.name} />
				</li>
			))}
		</ul>
	);
};

export default App;

