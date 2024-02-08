/**
 * Note: The Drag events
    SECOND : 
 * Drag Over -> the second area -> types[0] , when left (prevent default)
 * DragLeave -> when left 
 * Drop -> getData(text/pain)
    
    FIRST : 
 * dragstart -> setData , effectAllowed = move
 * dragend
 */

/**
 * MAIN THINGS :    
 * Decorators
 * Enum
 * Generics for class (exists for everything : can also be used in interfaces )
 */

function AutoBind(target: any, name: string, propertyDesc: PropertyDescriptor) {
	const orig = propertyDesc.value;

	const adj: PropertyDescriptor = {
		get() {
			const fn = orig.bind(this);
			return fn;
		},
	};
	return adj;
}

enum ProjStatus {
	Active,
	Finished,
}

// people title description
class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjStatus
	) {}
}

class ReadingTemplates<T extends HTMLElement, U> {
	template: T;
	app: U;
	constructor(id: string) {
		const template = document.getElementById(id)! as HTMLTemplateElement;

		this.app = document.getElementById("app")! as U;

		const x = document.importNode(template.content, true);
		this.template = x.firstElementChild as T;
	}
}

class Projects {
	private allProjects: Project[] = [];
	static instance: Projects;
	constructor() {}

	static giveInstance(): Projects {
		if (this.instance) return this.instance;

		this.instance = new Projects();
		return this.instance;
	}

	get Allprojects() {
		return this.allProjects.slice();
	}

	addProject(element: Project) {
		this.allProjects.push(element);
	}

	changeStatus(id: number) {
		const project: Project = this.allProjects.splice(id, 1)[0];
		project.status =
			ProjStatus.Active === project.status
				? ProjStatus.Finished
				: ProjStatus.Active;

		this.allProjects = [project, ...this.allProjects];

		act.render();
		fin.render();
	}
}

const instance = Projects.giveInstance();

class ProjectsRenderer extends ReadingTemplates<HTMLElement, HTMLDivElement> {
	projectElements: HTMLUListElement;

	constructor(private type: string) {
		super("project-list");

		(this.template.querySelector("h2")! as HTMLHeadingElement).textContent =
			type.toUpperCase() + " PROJECTS";

		this.projectElements = this.template.querySelector(
			"ul"
		) as HTMLUListElement;

		const listEl = this.template.querySelector("ul") as HTMLUListElement;
		listEl.id = `${this.type}-projects-list`;

		this.app.insertAdjacentElement("beforeend", this.template);

		this.template
			.querySelector("ul")
			?.addEventListener("dragover", this.dragOver);
		// this.template
		// .querySelector("ul")
		// ?.addEventListener("dragleave", this.dragLeave);

		// @AutoBind
		this.template
			.querySelector("ul")
			?.addEventListener("drop", this.drop.bind(this));
	}

	dragOver(dragOverEvent: DragEvent) {
		dragOverEvent.preventDefault();
	}

	drop(e: DragEvent) {
		// e.preventDefault();
		console.log("Drop : ", e, "\n", e.dataTransfer?.getData("text/plain"));

		const projects = instance.Allprojects;
		const projectId = projects.findIndex(
			(x) => x.id === e.dataTransfer?.getData("text/plain")
		);

		const project = projects[projectId];

		if (!project) return;

		if (
			project.status !==
			(this.type === "active" ? ProjStatus.Active : ProjStatus.Finished)
		) {
			instance.changeStatus(projectId);
		}
	}

	render() {
		const projects = instance.Allprojects;
		const ul = this.template.querySelector(
			`#${this.type}-projects-list`
		) as HTMLUListElement;

		if (ul != null) {
			ul.innerHTML = "";
		}

		for (const proj of projects) {
			if (
				proj.status ===
				(this.type === "active"
					? ProjStatus.Active
					: ProjStatus.Finished)
			) {
				const li = document.createElement("li");
				li.draggable = true;
				li.id = proj.id;
				const p1 = document.createElement("p");
				const p2 = document.createElement("p");
				const p3 = document.createElement("p");
				p1.textContent = proj.title;
				p2.textContent = proj.description;
				p3.textContent = String(proj.people);
				li.appendChild(p1);
				li.appendChild(p2);
				li.appendChild(p3);

				ul?.appendChild(li);

				li.addEventListener("dragstart", (e: DragEvent) => {
					if (
						e != null &&
						e.dataTransfer != null &&
						e.dataTransfer.effectAllowed != null
					)
						e.dataTransfer.effectAllowed = "move";
					e.dataTransfer?.setData("text/plain", proj.id);
				});
			}
		}
	}
}

// form content
class FormRender extends ReadingTemplates<HTMLFormElement, HTMLDivElement> {
	constructor() {
		super("project-input");
		this.template.id = "user-input";

		this.render();

		this.template.addEventListener("submit", this.formSubmitHandler);
	}

	@AutoBind
	private formSubmitHandler(e: Event) {
		e.preventDefault();

		const title = (
			this.template.querySelector("#title") as HTMLInputElement
		).value;
		const desc = (
			this.template.querySelector("#description") as HTMLTextAreaElement
		).value;
		const people = (
			this.template.querySelector("#people") as HTMLInputElement
		).value;

		if (!title || !desc || !people) {
			alert("Invalid Input");
			return;
		}

		const project: Project = new Project(
			Math.random().toString(),
			title,
			desc,
			+people,
			ProjStatus.Active
		);
		instance.addProject(project);
		act.render();
	}

	render() {
		this.app.insertAdjacentElement("afterbegin", this.template);
	}
}

new FormRender();
const act = new ProjectsRenderer("active");
const fin = new ProjectsRenderer("finished");
