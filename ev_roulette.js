// КЛАСС РУЛЕТКИ
// -----------------------------------------------------------------------------

function EvRoulette() {
	// тут будет всё оружие (оружие-приз + оружие-актёры)
	this.weapons = [];

	// DOM-элемент самой рулетки
	this.el = null;

	// родительский DOM-элемент для DOM-элементов оружия
	// (он вращается)
	this.el_weapons = null;

	// координата для translate3d
	this.x = 0;
}

// ПАРАМЕТРЫ РУЛЕТКИ
// -----------------------------------------------------------------------------

// N_WEAPONS -- это общее количество оружия в рулетке
// (приз + возможно повторяющиеся актёры)
//
// всего оружия должно быть не мешьше 8 штук
// вот как оно выглядит
//
// +---+---+---+     +---+---+---+---+---+
// | 0 | 1 | 2 | ... |L-5|L-4|L-3|L-2|L-1|
// +---+---+---+     +---+---+---+---+---+
//
// L -- это N_WEAPONS
// (или после вызова метода 'set_weapons': this.weapons.length)
//
// L-3 -- на этом месте оружие-приз

// первые N оружий, которые быстро вращаются
EvRoulette.N_WEAPONS_SPIN_FAST = 10;

// следующие N оружий, которые медленно вращаются
EvRoulette.N_WEAPONS_SPIN_SLOW = 5;

// заключительные N оружий, которые очень медленно вращаются
// (и среди них оружие-приз)
EvRoulette.N_WEAPONS_SPIN_SUPERSLOW = 5;
// ВНИМАНИЕ: не меняй число 5
// (смотри схему, нужны все элементы на позициях с L-5 по L-1)

// общее количество оружия
EvRoulette.N_WEAPONS = EvRoulette.N_WEAPONS_SPIN_FAST +
                       EvRoulette.N_WEAPONS_SPIN_SLOW +
                       EvRoulette.N_WEAPONS_SPIN_SUPERSLOW;

// айди приза
EvRoulette.WEAPON_PRIZE_ID = EvRoulette.N_WEAPONS - 3;

// шаг вращения на разных скоростях
EvRoulette.SPIN_STEP_FAST      = 100; // 1/2 EvWeapon.EL_WIDTH
EvRoulette.SPIN_STEP_SLOW      = 50;  // 1/4 EvWeapon.EL_WIDTH
EvRoulette.SPIN_STEP_SUPERSLOW = 25;  // 1/8 EvWeapon.EL_WIDTH

// количество быстрых вращений с шагом 1/2 ширины элемента
EvRoulette.N_SPINS_FAST = EvRoulette.N_WEAPONS_SPIN_FAST * 2;

// количество медленных вращений с шагом 1/4 ширины элемента
EvRoulette.N_SPINS_SLOW = EvRoulette.N_WEAPONS_SPIN_SLOW * 4;

// количество полных очень медленных вращений
// вопрос: почему 4, а не 8?
//  ответ: для преодоления дистанции одного оружия требуется 8 очень медленных
//         вращений; но мне нужна только половина (после этого мишень будет
//         ровно на середине элемента L-5
EvRoulette.N_SPINS_SUPERSLOW = 4;

// чтобы призовое оружие оказалось под мишенью, задействованы ещё несколько
// рандомных очень медленных вращений
// вопрос: что ещё за рандом?
//  ответ: рандом создаст эффект случайной финишной позиции; оружие-приз
//         сможет оказаться не чётко посередине, а чуть правее или левее 
EvRoulette.N_SPINS_SUPERSLOW_RAND_MIN = 1;
EvRoulette.N_SPINS_SUPERSLOW_RAND_MAX = 7;

// интервалы вращения в миллисекундах
EvRoulette.INTERVAL = 125;

// небольшая пауза перед полной остановкой (тоже в миллисекундах)
EvRoulette.TIMEOUT_STOP = 250;

// звуки
EvRoulette.SOUND_START = 'snd/roulette_start.wav';
EvRoulette.SOUND_SPIN  = 'snd/roulette_spin.wav';
EvRoulette.SOUND_STOP  = 'snd/roulette_stop.wav';

// частота звуков вращения на разных скоростях
EvRoulette.SOUND_FREQUENCY_FAST      = 2;
EvRoulette.SOUND_FREQUENCY_SLOW      = 4;
EvRoulette.SOUND_FREQUENCY_SUPERSLOW = 8;

// СОЗДАТЬ ОРУЖИЕ ИЗ АТРИБУТОВ
// -----------------------------------------------------------------------------

// вопрос: что тут происходит?
//  ответ: - создаётся массив из N_WEAPONS-1 актёров
//         - позицию WEAPON_PRIZE_ID занимает приз

EvRoulette.prototype.set_weapons = function (weapon_prize_attrs,
                                             weapon_actors_attrs) {
	var
		weapons           = [],
		weapon_actors_len = weapon_actors_attrs.length,
		j                 = 0,
		set_weapon_actors = function (from_i, to_i) {
			var i;
			for (i = from_i; i <= to_i; i += 1) {
				weapons[i] = new EvWeapon(
					i,
					weapon_actors_attrs[j]
				);
				j = (j === weapon_actors_len - 1) ? 0 : j + 1;
			}
		};

	if (weapon_actors_len === 0) {
		throw new Error('Ошибка! Нет актёров.');
	}

	set_weapon_actors(0, EvRoulette.WEAPON_PRIZE_ID - 1);

	weapons[EvRoulette.WEAPON_PRIZE_ID] = new EvWeapon(
		EvRoulette.WEAPON_PRIZE_ID,
		weapon_prize_attrs
	);

	set_weapon_actors(EvRoulette.WEAPON_PRIZE_ID + 1, EvRoulette.N_WEAPONS - 1);

	this.weapons = weapons;
};

// ОТРИСОВАТЬ НАЧАЛЬНОЕ ПОЛОЖЕНИЕ РУЛЕТКИ И ОРУЖИЯ
// -----------------------------------------------------------------------------

EvRoulette.prototype.render = function (el_parent) {
	var
		el_roulette = document.createElement('div'),
		el_target   = document.createElement('div'),
		el_weapons  = document.createElement('div');

	el_roulette.id = 'ev-roulette';
	el_target.id   = 'ev-target';
	el_weapons.id  = 'ev-weapons';

	el_weapons.style.width = (EvRoulette.N_WEAPONS * EvWeapon.EL_WIDTH) + 'px';

	// рендер оружия
	this.weapons.forEach(function (weapon) {
		weapon.render();
		el_weapons.appendChild(weapon.el);
	});

	el_roulette.appendChild(el_target);
	el_roulette.appendChild(el_weapons);

	// осталось примонтировать
	el_parent.appendChild(el_roulette);

	// рулетка готова
	this.el_weapons = el_weapons;
	this.el         = el_roulette;
};

// УЧУ РУЛЕТКУ ИЗДАВАТЬ ЗВУКИ
// -----------------------------------------------------------------------------

EvRoulette.prototype.make_sound = function (sound) {
	var audio    = new Audio(sound);
	audio.volume = 0.2;
	audio.play();
};

// СЛУЧАЙНОЕ ЧИСЛО ОЧЕНЬ МЕДЛЕННЫХ ВРАЩЕНИЙ
// -----------------------------------------------------------------------------

EvRoulette.prototype.rand_n_spins_superslow = function () {
	var 
		min  = EvRoulette.N_SPINS_SUPERSLOW_RAND_MIN,
		max  = EvRoulette.N_SPINS_SUPERSLOW_RAND_MAX,
		rand = Math.floor(Math.random() * (max - min + 1)) + min;
	return EvRoulette.N_SPINS_SUPERSLOW + rand;
};

// ВРАЩЕНИЕ РУЛЕТКИ
// -----------------------------------------------------------------------------

EvRoulette.prototype.spin = function (spin_step) {
	this.x -= spin_step;
	var translate3d = 'translate3d(' + this.x + 'px, 0, 0)';

	this.el_weapons.style.transform            = translate3d;
	this.el_weapons.style['-webkit-transform'] = translate3d;
};

// ЗАПУСК РУЛЕТКИ
// -----------------------------------------------------------------------------

EvRoulette.prototype.start = function () {
	var
		self                   = this,
		n_spins_fast           = 0,
		n_spins_slow           = 0,
		n_spins_superslow      = 0,
		n_spins_superslow_rand = this.rand_n_spins_superslow(),
		interval,

		// звук вращения
		// для разных скоростей разная частота повторов
		make_sound_spin = function (n_spins_speed, frequency) {
			if (n_spins_speed % frequency === 0) {
				self.make_sound(EvRoulette.SOUND_SPIN);
			}
		},

		// первая часть: быстрые вращения
		spin_fast = function () {
			n_spins_fast += 1;
			make_sound_spin(n_spins_fast, EvRoulette.SOUND_FREQUENCY_FAST);
			self.spin(EvRoulette.SPIN_STEP_FAST);
			if (n_spins_fast === EvRoulette.N_SPINS_FAST) {
				clearInterval(interval);
				interval = setInterval(spin_slow, EvRoulette.INTERVAL);
			}
		},

		// вторая часть: медленные вращения
		spin_slow = function () {
			n_spins_slow += 1;
			make_sound_spin(n_spins_slow, EvRoulette.SOUND_FREQUENCY_SLOW);
			self.spin(EvRoulette.SPIN_STEP_SLOW);
			if (n_spins_slow === EvRoulette.N_SPINS_SLOW) {
				clearInterval(interval);
				interval = setInterval(spin_superslow, EvRoulette.INTERVAL);
			}
		},

		// третья часть: очень медленные вращения и финиш
		spin_superslow = function () {
			n_spins_superslow += 1;
			make_sound_spin(n_spins_superslow,
			                EvRoulette.SOUND_FREQUENCY_SUPERSLOW);
			self.spin(EvRoulette.SPIN_STEP_SUPERSLOW);
			if (n_spins_superslow === n_spins_superslow_rand) {
				clearInterval(interval);
				self.stop();
			}
		};

	// бибикнуть и начать с быстрых вращений
	self.make_sound(EvRoulette.SOUND_START);
	interval = setInterval(spin_fast, EvRoulette.INTERVAL);
};

// ОСТАНОВКА РУЛЕТКИ
// -----------------------------------------------------------------------------

EvRoulette.prototype.stop = function () {
	var self = this;
	setTimeout(function () {
		self.make_sound(EvRoulette.SOUND_STOP);
		self.weapons.forEach(function (weapon) {
			if (weapon.id !== EvRoulette.WEAPON_PRIZE_ID) {
				weapon.el.style.opacity = 0.5;
			}
		});
	}, EvRoulette.TIMEOUT_STOP);
};
