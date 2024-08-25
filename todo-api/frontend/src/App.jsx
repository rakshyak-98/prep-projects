import { useEffect, useRef, useState } from "react";
import "./App.css";

const URI = {
	GET_TODO: new URL("http://localhost:3000/todo"),
	PATCH_TODO: new URL("http://localhost:3000/todo/"),
	CREATE_TODO: new URL("http://localhost:3000/todo"),
};

function logger(message, type) {
	console[type](message);
}

async function fetchTodo() {
	try {
		const response = await fetch(URI.GET_TODO);
		const responseBody = await response.json();
		const todo = responseBody["docs"];
		return todo;
	} catch (error) {
		logger(error, "error");
		return [];
	}
}

async function updateTodoStatus(state, id) {
	try {
		const response = fetch(`http://localhost:3000/todo/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				completed: state,
			}),
		});
		if (response.ok) {
			const responseBody = await response.json();
			console.log(responseBody);
		}
	} catch (error) {
		logger(error, "error");
	}
}

async function createTodo(todo) {
	await fetch(URI.CREATE_TODO, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(todo),
	});
}

function App() {
	const todoTitleInputRef = useRef();
	const [todo, setTodo] = useState([]);
	const [selected, setSelected] = useState([]);
	const [isCreating, setCreating] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const todo = await fetchTodo();
			setTodo(todo);
			setSelected(todo.map((item) => ({ ...item, isSelected: false })));
		};
		fetchData();
	}, []);

	function selectTodo(event) {
		const id = event.target.id;
		setSelected((prev) => {
			return prev.map((item) => {
				if (item._id === id) {
					return { ...item, isSelected: !item.isSelected };
				}
				return item;
			});
		});
	}

	function getTodoStateClass(v) {
		if (v.isSelected) {
			return "todo-item selected";
		} else if (v.completed) {
			return "todo-item completed";
		}
		return "todo-item";
	}

	async function markComplete() {
		selected.forEach((item) => {
			if (item.isSelected) {
				updateTodoStatus(true, item._id);
			}
		});
	}

	async function markIncomplete() {
		selected.forEach((item) => {
			if (item.isSelected) {
				updateTodoStatus(false, item._id);
			}
		});
	}

	function openTodoCreate() {
		setCreating(true);
		console.log(todoTitleInputRef)
	}

	return (
		<main>
			<h1 className="todo-heading">Todo</h1>
			<div className="todo-action">
				<button className="todo-btn-create" onClick={openTodoCreate}>
					Create todo
				</button>
				<button className="todo-btn-complete" onClick={markComplete}>
					Mark complete
				</button>
				<button className="todo-btn-incomplete" onClick={markIncomplete}>
					Mark In-complete
				</button>
				<button className="todo-btn-delete">Delete</button>
			</div>
			{isCreating ? (
				<input
					ref={todoTitleInputRef}
					className="new-todo-input"
					type="text"
					placeholder="Todo title"
				/>
			) : null}
			<ul className="todo-list">
				{selected.map((v) => {
					return (
						<li
							key={v._id}
							id={v._id}
							className={getTodoStateClass(v)}
							onClick={selectTodo}
						>
							{v.title}
						</li>
					);
				})}
			</ul>
		</main>
	);
}

export default App;
