import CardProduct from "../components/Fragments/CardProudct";
import Button from "../components/Elements/Button";
import { useState } from "react";
const products = [
	{
		id: 1,
		name: "Sepatu Naiki Jindan",
		price: 1000000,
		image: "images/shoes-1.jpg",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates",
	},
	{
		id: 2,
		name: "Sepatu Retno",
		price: 500000,
		image: "images/shoes-1.jpg",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet reprehenderit numquam in reiciendis accusantium deserunt!",
	},
	{
		id: 3,
		name: "Sepatu Nathan Gita",
		price: 2000000,
		image: "images/shoes-1.jpg",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae ducimus beatae incidunt in porro sit amet quam ipsa fugit corrupti?",
	},
];

const email = localStorage.getItem("email");

export default function ProductsPage() {
	const [cart, setCart] = useState([]);

	const handleLogout = () => {
		localStorage.removeItem("email");
		localStorage.removeItem("password");
		window.location.href = "/login";
	};

	const handleAddToCart = (id) => {
		if (cart.find((item) => item.id === id)) {
			setCart(
				cart.map((item) =>
					item.id === id ? { ...item, qty: item.qty + 1 } : item
				)
			);
		} else {
			setCart([...cart, { id, qty: 1 }]);
		}
	};

	return (
		<>
			<div className="flex justify-end h-20 bg-gray-800 text-white items-center px-10 py-14 font-bold">
				{email}
				<Button
					classname="bg-white text-gray-800 mx-10"
					onClick={handleLogout}
					width="150px"
				>
					Logout
				</Button>
			</div>
			<div className="flex justify-center py-5 ml-10">
				<div className={`${cart ? "w-1" : "w-4/6"}w-4/6 flex flex-w`}>
					{products.map((product) => (
						<CardProduct key={product.id}>
							<CardProduct.Header image={product.image}></CardProduct.Header>
							<CardProduct.Body name={product.name}>
								{product.description}
							</CardProduct.Body>
							<CardProduct.Footer
								handleAddToCart={handleAddToCart}
								price={product.price}
								id={product.id}
							></CardProduct.Footer>
						</CardProduct>
					))}
				</div>
				{cart.length > 0 && (
					<div className="w-2/6">
						<h1 className="text-3xl font-bold ml-5">Cart</h1>
						{/* <ul>
						{cart.map((item) => (
							<li key={item.id}>{item.id}</li>
						))}
					</ul> */}
						<table className="text-left table-auto border-separate border-spacing-x-5">
							<thead>
								<tr>
									<th>Product</th>
									<th>Price</th>
									<th>QUantity</th>
									<th>Total</th>
								</tr>
							</thead>
							<tbody>
								{cart.map((item) => {
									const product = products.find(
										(product) => product.id === item.id
									);
									return (
										<tr key={item.id}>
											<td>{product.name}</td>
											<td>
												Rp{" "}
												{product.price.toLocaleString("id-ID", {
													styles: "currency",
													currency: "IDR",
												})}
											</td>
											<td>{item.qty}</td>
											<td>Rp {item.qty * product.price}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</>
	);
}
