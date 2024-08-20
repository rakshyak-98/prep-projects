import { faker } from "@faker-js/faker";
import { useEffect, useReducer, useRef } from "react";

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

function productReducer(state, action) {
	return state;
}

function lazyInit() {
	return generateRandomProductList(100);
}

const App = () => {
	const [products, dispatch] = useReducer(productReducer, [], lazyInit);
	return (
		<ul style={gridView}>
			{products.map((product) => (
				<li style={li} key={product.id}>
					<LazyImage style={image} src={product.picture} alt={product.name} />
				</li>
			))}
		</ul>
	);
};

function LazyImage({ style, src, alt }) {
	const imageRef = useRef(null);
	useEffect(() => {
		const imageObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = imageRef.current;
					img.src = src;
					img.alt = alt;
					img.style = style;
					imageObserver.unobserve(img);
				}
			});
		});
		imageObserver.observe(imageRef.current);
		return () => {
			imageObserver.disconnect();
		};
	}, []);
	return (
		<img
			ref={imageRef}
			style={{
				width: "100%",
				height: "auto",
			}}
			src={src}
			alt={alt}
		/>
	);
}

export default App;
