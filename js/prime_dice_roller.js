//import Mustache from 'mustache';

class PRIME_DICE_ROLLER extends FormApplication
{
	primeTable = [-5,-4,-3,-2,-2,-1,-1,-1,0,0,0,0,1,1,1,2,2,3,4,5];

	constructor(...args)
	{
        super(...args)
        game.users.apps.push(this)
    }

	static get defaultOptions()
	{
        const options = super.defaultOptions;
        options.title = game.i18n.localize("PRIME_DICE.Title");
        options.id = "primeDiceRoller";
        options.template = "modules/PrimeDice/templates/roller.html";
        options.closeOnSubmit = true;
        options.popOut = true;
        options.width = 600;
        options.height = "auto";
		options.classes = ["prime-dice"];
		
        return options;
    }

	async getData()
	{
        // Return data to the template
        const actors = game.actors.entities;
		const users = game.users.entities;

		const primes = this.getPrimes()
		const refinements =
		[
			{name: "ventriloquism", title: "Ventriloquism"},
			{name: "torture", title: "Torture"},
			{name: "divination", title: "Divination - NO."},
			{name: "bureaucracy", title: "Bureaucracy"}
		];
		
        return {
            actors,
			users,
			primes,
			refinements
			/*,
            abilities,
            saves,
            skills,
            specialRolls: LMRTFY.specialRolls,
            rollModes: CONFIG.Dice.rollModes,*/
        };
	}

	getPrimes()
	{
		if (game.system.template.Actor.character.primes)
		{
			let primes = [];
			for (let currAbbrevation in game.system.template.Actor.character.primes)
			{
				primes.push({name: currAbbrevation, title: game.i18n.localize("PRIME.Prime_" + currAbbrevation)});
			}
			return primes;
		}
		console.error("Unable to find primes data.");
		return [];	
	}

	render(force, context={})
	{
        // Only re-render if needed
        const {action, data} = context;
        if (action && !["create", "update", "delete"].includes(action)) return;
        if (action === "update" && !data.some(d => "character" in d)) return;
        if (force !== true && !action) return;
        return super.render(force, context);
    }
    
	activateListeners(html)
	{
		super.activateListeners(html);
		this.element.find(".rollPrimeDice").click((event) => this.rollPrimeDice(event, true));
		/*
        this.element.find(".select-all").click((event) => this.setActorSelection(event, true));
        this.element.find(".deselect-all").click((event) => this.setActorSelection(event, false));
        this.element.find("select[name=user]").change(this._onUserChange.bind(this));
        this.element.find(".lmrtfy-save-roll").click(this._onSubmit.bind(this));
        this.element.find(".lmrtfy-actor").hover(this._onHoverActor.bind(this));
		this._onUserChange();
		*/
	}
	
/* 
user: "UkOsJlDj4Mm9dzHn"
speaker: {scene: "KM9drCFgWvRwjjZM", actor: null, token: null, alias: "Gamemaster"}
content: "↵<div class="sp"></div>"
roll: 

return Mustache.render(
	base,
	{
		system: this.command,
		canReRoll: this.canReRoll,
		canKeep: this.canKeep,
		flavorText,
		rolls: rolls.map((roll) => new DieRollView(roll, dieRollImages)),
		results: interpretResult(combinedRolls),
		rollIndex(): number {
			return rolls.indexOf(this);
		},
	},
	{interpretation: tpl},
);

 */

	async rollPrimeDice()
	{
		var diceResult = this.getDiceResult();
		var messageContent = await this.createContent(diceResult);
		let data =
		{
			sound: CONFIG.sounds.dice,
			content: messageContent
		};
		let options = {};
		ChatMessage.create(data, options)

		//this.testDiceRolling(10000);

	}

	getDiceResult()
	{
		var currentDie = new Die(20);
		this.rollDie(currentDie);
		var primeDiceResult = this.getPrimeDiceResultData(currentDie);
		//if (primeDiceResult.diceRolls.length > 2)
		//{
		//	console.log(primeDiceResult);
		//}
		return primeDiceResult;
	}

	rollDie(whatDie)
	{
		whatDie.roll(1);
		var lastDice = whatDie.rolls[whatDie.rolls.length - 1]
		if (lastDice.roll == 1 || lastDice.roll == 20)
		{
			this.rollDie(whatDie);
		}
	}

	getPrimeDiceResultData(foundryDice)
	{
		var _modifier = 0;
		var _primeResults = foundryDice.rolls.map(currResult => 
		{
			let _primeModifier = this.primeTable[currResult.roll - 1];
			_modifier += _primeModifier;
			return {...currResult, primeModifier: _primeModifier};
		});

		var _primeDiceResults =
		{
			diceRolls: _primeResults,
			total: _modifier
		};
		return _primeDiceResults;
	}

	async createContent(diceResult)
	{
		var handlebarsTemplate = await getTemplate("modules/PrimeDice/templates/primeResult.html");
		var messageContent = handlebarsTemplate(diceResult);
		return messageContent
	}

	async _updateObject(event, formData)
	{
	}
	
	testDiceRolling(_testIterations)
	{
		var count = 0
		var _resultsObject = {}
		while (count < _testIterations)
		{
			let result = this.getDiceResult().total;
			if (!_resultsObject[result])
			{
				_resultsObject[result] = {total: 0};
			}
			_resultsObject[result].total++;
			count++;
		}

		count = 0;

		for (var _currResult in _resultsObject)
		{
			_resultsObject[_currResult].percentage = (_resultsObject[_currResult].total / _testIterations) * 100;
			count++;
		}

		console.log(_resultsObject);
	}
}

Handlebars.registerHelper('primeDiceClass', function(value)
{
	if (value === 1)
	{
		return "misfortunePrimeRoll lowPrimeRoll";
	}
	if (value === 20)
	{
		return "fortunePrimeRoll highPrimeRoll"
	}

	if (value < 9)
	{
		return "lowPrimeRoll";
	}
	if (value > 12)
	{
		return "highPrimeRoll"
	}
	return "";
});

Handlebars.registerHelper('primeDiceModiferClass', function(value)
{
	if (value > 0)
	{
		return "highPrimeModifierResult";
	}
	if (value < 0)
	{
		return "lowPrimeModifierResult";
	}
	return "";
});