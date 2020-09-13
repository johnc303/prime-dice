class PRIME_DICE {
	static async init()
	{
		// Adds a setting property to the settings
		/*
		game.settings.register('lmrtfy', 'enableParchmentTheme', {
			name: game.i18n.localize('LMRTFY.EnableParchmentTheme'),
			hint: game.i18n.localize('LMRTFY.EnableParchmentThemeHint'),
			scope: 'client',
			config: true,
			type: Boolean,
			default: true,
			onChange: (value) => LMRTFY.onThemeChange(value)
		});
		*/
	}

	static ready()
	{
		// Client to client socket comms

		/*
		game.socket.on('module.lmrtfy', LMRTFY.onMessage);
		*/

		// Checking system and binding to relevant data points
		/*
		if(game.system.id == "pf2e") {
				LMRTFY.saveRollMethod = 'rollSave';
				LMRTFY.abilityRollMethod = 'rollAbility';
				LMRTFY.skillRollMethod = 'rollSkill';
				LMRTFY.abilities = CONFIG.PF2E.abilities;
				LMRTFY.skills = CONFIG.PF2E.skills;
				LMRTFY.saves = CONFIG.PF2E.saves;
				LMRTFY.normalRollEvent  = { shiftKey: false, altKey: false, ctrlKey: false };
				LMRTFY.advantageRollEvent = { shiftKey: false, altKey: true, ctrlKey: false };
				LMRTFY.disadvantageRollEvent = { shiftKey: false, altKey: false, ctrlKey: true };
				LMRTFY.queryRollEvent = { shiftKey: true, altKey: false, ctrlKey: false };
				LMRTFY.specialRolls = { 'initiative': true, 'deathsave': true, 'perception': true };
		} else {
				LMRTFY.saveRollMethod = 'rollAbilitySave';
				LMRTFY.abilityRollMethod = 'rollAbilityTest';
				LMRTFY.skillRollMethod = 'rollSkill';
				LMRTFY.abilities = CONFIG.DND5E.abilities;
				LMRTFY.skills = CONFIG.DND5E.skills;
				LMRTFY.saves = CONFIG.DND5E.abilities;
				LMRTFY.normalRollEvent  = { shiftKey: true, altKey: false, ctrlKey: false };
				LMRTFY.advantageRollEvent = { shiftKey: false, altKey: true, ctrlKey: false };
				LMRTFY.disadvantageRollEvent = { shiftKey: false, altKey: false, ctrlKey: true };
				LMRTFY.queryRollEvent = { shiftKey: false, altKey: false, ctrlKey: false };
				LMRTFY.specialRolls = { 'initiative': true, 'deathsave': true };
		}
		*/
	}

	static renderChatLog()
	{
		PRIME_DICE.attachedToRollDiceIcon()
	}

	static attachedToRollDiceIcon()
	{
		var diceIcon = $('.roll-type-select .fas.fa-dice-d20');
		
		diceIcon.on('click', (event) => {
			PRIME_DICE.openPrimeDice();
		});
	}


	// Message handler
	/*
	static onMessage(data)
	{
			//console.log("LMRTF got message: ", data)
			if (data.user === "character" &&
					(!game.user.character || !data.actors.includes(game.user.character.id)))
					return;
			else if (!["character", "tokens"].includes(data.user) && data.user !== game.user.id)
					return;
			let actors = [];
			if (data.user === "character")
					actors = [game.user.character];
			else if (data.user === "tokens")
					actors = canvas.tokens.controlled.map(t => t.actor);
			else
					actors = data.actors.map(id => game.actors.get(id));
			actors = actors.filter(a => a);
			if (actors.length === 0) return;
			new LMRTFYRoller(actors, data).render(true);
	}
	*/

	/*
	static requestRoll() {
		if (LMRTFY.requestor === undefined)
			LMRTFY.requestor = new LMRTFYRequestor();
		LMRTFY.requestor.render(true);
	}
	*/
	
	/*
	static onThemeChange(enabled) {
			$(".lmrtfy.lmrtfy-requestor,.lmrtfy.lmrtfy-roller").toggleClass("lmrtfy-parchment", enabled)
			if (!LMRTFY.requestor) return;
			if (enabled)
					LMRTFY.requestor.options.classes.push("lmrtfy-parchment")
			else
					LMRTFY.requestor.options.classes = LMRTFY.requestor.options.classes.filter(c => c !== "lmrtfy-parchment")
			// Resize to fit the new theme
			if (LMRTFY.requestor.element.length)
					LMRTFY.requestor.setPosition({width: "auto", height: "auto"})
	}
	*/

	static openPrimeDice()
	{
		alert("Prime dice!");
	}

	static getSceneControlButtons(buttons)
	{
		let tokenButton = buttons.find(b => b.name == "token")

		if (tokenButton)
		{
			tokenButton.tools.push(
			{
				name: "prime-dice",
				title: game.i18n.localize('PRIME_DICE.Title'),
				icon: "fas fa-dice-d20",
				onClick: () => PRIME_DICE.openPrimeDice(),
				button: true
			});
		}
	}
}

Hooks.once('init', PRIME_DICE.init);
Hooks.on('ready', PRIME_DICE.ready);
Hooks.on('getSceneControlButtons', PRIME_DICE.getSceneControlButtons)
Hooks.on('renderChatLog', PRIME_DICE.renderChatLog);
