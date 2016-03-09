// КЛАСС ОРУЖИЯ
// -----------------------------------------------------------------------------

function EvWeapon(id, attrs) {
	this.id          = id; // идентификатор соответствует порядковому индексу в
	                       // массиве weapons класса EvRoulette
	this.weapon_name = attrs.weapon_name;
	this.skin_name   = attrs.skin_name;
	this.rarity      = attrs.rarity;
	this.steam_image = attrs.steam_image;
	this.el          = null; // DOM-элемент создаётся ниже
}

EvWeapon.EL_WIDTH = 200;

EvWeapon.prototype.render = function () {
	var
		el_weapon                = document.createElement('div'),
		el_weapon_inner          = document.createElement('div'),
		el_weapon_rarity         = document.createElement('div'),
		el_weapon_img            = document.createElement('img'),
		el_weapon_text           = document.createElement('div'),
		el_weapon_text_name      = document.createElement('p'),
		el_weapon_text_skin_name = document.createElement('p');

	el_weapon_img.src                    = this.steam_image;
	el_weapon_img.alt                    = this.weapon_name;
	el_weapon_text_name.textContent      = this.weapon_name;
	el_weapon_text_skin_name.textContent = this.skin_name;

	el_weapon.className        = 'ev-weapon';
	el_weapon_inner.className  = 'ev-weapon-inner';
	el_weapon_rarity.className = 'ev-weapon-rarity ' +
		'ev-weapon-rarity-' + this.rarity;
	el_weapon_text.className   = 'ev-weapon-text';

	el_weapon_text.appendChild(el_weapon_text_name);
	el_weapon_text.appendChild(el_weapon_text_skin_name);
	el_weapon_inner.appendChild(el_weapon_rarity);
	el_weapon_inner.appendChild(el_weapon_img);
	el_weapon_inner.appendChild(el_weapon_text);
	el_weapon.appendChild(el_weapon_inner);

	this.el = el_weapon;
};
