function AutoBind(target: any, name: string, propetyDesc: PropertyDescriptor) {
	const orig = propetyDesc.value;

	const adjusted: PropertyDescriptor = {
		enumerable: false,
		configurable: true,
		get() {
			const bindFn = orig.bind(this);
			return bindFn;
		},
	};

	return adjusted;
}

interface validationObj {
	value: string | number;
	required?: boolean;
	min?: number;
	max?: number;
	minLength?: number;
	maxLength?: number;
}

function validatorTrim(valInput: validationObj) {
	let valid = true;

	if (valInput.required && !valInput.value.toString().trim()) valid = false;

	if (
		valInput.min &&
		typeof valInput.value === "number" &&
		valInput.value < valInput.min
	)
		valid = false;

	if (
		valInput.max &&
		typeof valInput.value === "number" &&
		valInput.value < valInput.max
	)
		valid = false;

	if (
		valInput.minLength &&
		typeof valInput.value === "string" &&
		valInput.value.toString().trim().length < valInput?.minLength
	)
		valid = false;

	if (
		valInput.maxLength &&
		typeof valInput.value === "string" &&
		valInput.value.length < valInput?.maxLength
	)
		valid = false;

	return valid;
}

// To take the project list template from html and render

class ProjectListRender {
	templateEl: HTMLTemplateElement;
	hostEl: HTMLDivElement;
	element: HTMLElement;

	constructor(private type: "active" | "finished") {
		this.templateEl = document.getElementById(
			"project-list"
		) as HTMLTemplateElement;
		this.hostEl = document.getElementById("app")! as HTMLDivElement;

		const importedNode = document.importNode(this.templateEl, true);
		this.element = importedNode.firstElementChild as HTMLElement;

		this.element.id = `${this.type}-projects`;

		this.attachTo_Host();
		this.renderContent();
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`;

		this.element.querySelector("ul")!.id = listId;
		this.element.querySelector("h2")!.textContent =
			this.type.toUpperCase() + " PROJECTS";
	}

	private attachTo_Host() {
		this.hostEl.insertAdjacentElement("beforeend", this.element);
	}
}

// To initiate from the template , we have in Html , (( WORKED FINE , glitch with binder))
class InputHolder {
	templateEl: HTMLTemplateElement;
	hostEl: HTMLDivElement;
	element: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		this.templateEl = document.getElementById(
			"project-input"
		)! as HTMLTemplateElement;

		this.hostEl = document.getElementById("app")! as HTMLDivElement;

		const importedNode = document.importNode(this.templateEl.content, true);

		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.element.id = "user-input";

		this.titleInputElement = this.element.querySelector(
			"#title"
		) as HTMLInputElement;
		this.descInputElement = this.element.querySelector(
			"#description"
		) as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector(
			"#people"
		) as HTMLInputElement;

		this.attachTo_Host();
		this.configure();
	}

	private takingInput(): [string, string, number] | void {
		const title = this.titleInputElement.value;
		const desc = this.descInputElement.value;
		const no_people = this.peopleInputElement.value;

		const titleValid: validationObj = {
			value: title,
			required: true,
		};

		const descValid: validationObj = {
			value: desc,
			required: true,
			minLength: 5,
		};

		const no_people_valid: validationObj = {
			value: +no_people,
			required: true,
			min: 1,
			max: 5,
		};

		if (
			!(
				validatorTrim(titleValid) &&
				validatorTrim(descValid) &&
				validatorTrim(no_people_valid)
			)
		) {
			alert("Not a valid input , please try again !!!");
			return;
		}
		return [title, desc, +no_people];
	}

	private clearInput() {
		this.titleInputElement.value = "";
		this.descInputElement.value = "";
		this.peopleInputElement.value = "";
	}

	@AutoBind
	private submit(e: Event) {
		// console.log(this.titleInputElement);
		e.preventDefault();
		const userInput = this.takingInput();

		if (userInput?.length) {
			this.clearInput();
		}
	}

	private configure() {
		// this.element.addEventListener("submit", this.submit.bind(this));
		this.element.addEventListener("submit", this.submit);
	}

	private attachTo_Host() {
		this.hostEl.insertAdjacentElement("afterbegin", this.element);
	}
}

new InputHolder();
new ProjectListRender("active");
new ProjectListRender("finished");
