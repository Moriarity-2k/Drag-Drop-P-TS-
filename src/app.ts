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

function validatorTrim(target: any, name: string) {
    console.log(target);
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
		const no_people = +this.peopleInputElement.value;

		return [title, desc, no_people];
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
