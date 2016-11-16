class ToDoItem extends React.Component {
	render() {
		return (
			<li>
				<input
					id={this.props.taskId}
					className="checkbox"
					type="checkbox"

					checked={(this.props.taskState)?(true):(false)}
				/>
				<label
					htmlFor={this.props.id}
					className={(this.props.taskState)?('completed'):('')}
					onClick={this.props.onToDoComplete}
				>
					{this.props.taskText}
				</label>
				<button 
					className="todo-remove"
					onClick={this.props.onToDoRemove}
				>
					✕
				</button>
			</li>
		)
	}
}

class ToDoList extends React.Component {	

	render() {		

		const handleToDoComplete = this.props.onToDoComplete;
    	const handleToDoRemove = this.props.onToDoRemove;

		return (
			<ul	className="todo-list">
				{
					this.props.tasks.map(task =>
                        <ToDoItem
                        	key={task.id}
                            taskId={task.id}
                            taskState={task.complete}
                            taskText={task.text}
                            onToDoComplete={handleToDoComplete.bind(null, task)}
                            onToDoRemove={handleToDoRemove.bind(null, task)}
                        />
                    )
				}
			</ul>
		)
	}
}

class ToDoNew extends React.Component {

	handleKeyPress(e) {
		if(e.key === 'Enter') {
			const newTask = {
				id : Date.now(),
				text : e.target.value,
				complete : false
			};
			this.props.onToDoNew(newTask);
			e.target.value = '';
		}
	}

	render() {
		return (
			<div className="todo-new">
				<input
					type="text"
					placeholder="What to do"
					onKeyPress={this.handleKeyPress.bind(this)}
				/>
			</div>
		)
	}
}

class ToDoApp extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	tasks: []
	    };
    }

	componentWillMount() {
		const tasks = localStorage.getItem('tasks');

		if(tasks) {
			this.setState({
				tasks: JSON.parse(tasks)
			});
		};
	}

	componentDidUpdate() {	
		const tasks = JSON.stringify(this.state.tasks);
        localStorage.setItem('tasks', tasks);
	}

	handleToDoNew(task) {
		let currentTasks = this.state.tasks.slice();

		if(task.text) 
			currentTasks.unshift(task);
		
		this.setState({
			tasks: currentTasks
		});
	}

	handleToDoComplete(task) {
        let tasks = this.state.tasks.slice();

        tasks.map(elem => {
            if(elem.id === task.id)
                elem.complete = !elem.complete;
        });

        this.setState({
            tasks: tasks
        });
    }

	handleToDoRemove(task) {
        const newTasks = this.state.tasks.filter(el => el.id !== task.id);

        this.setState({
            tasks : newTasks
        });
    }

	render() {

		return (
			<div id="todo-app">
				<ToDoNew onToDoNew={this.handleToDoNew.bind(this)} />
				<ToDoList
                    tasks={this.state.tasks}
                    onToDoComplete={this.handleToDoComplete.bind(this)}
                    onToDoRemove={this.handleToDoRemove.bind(this)}
                />
			</div>
		);
	}
}

ReactDOM.render(
    <ToDoApp />,
    document.getElementById('container')
);