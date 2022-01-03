
<div align="center">
<br />
<p>
<a href="https://blackhole.net"><img src="https://cdn.discordapp.com/attachments/908469379082092645/925014150562844692/BlackHole_Logo.png" width="456" alt="blackhole" /></a>
</p>
<br />
<p>
<a href="https://discord.gg/rtPazUx"><img src="https://img.shields.io/discord/743787965590929598?style=flat-square&color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
<a href="https://nodejs.org/en/"><img src="https://img.shields.io/node/v/discord.js.svg?style=flat-square&logo=node.js&logoColor=white&maxAge=3600" alt="node version" /></a>
<a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/v/discord.js.svg?style=flat-square&logo=discord&logoColor=white&label=discordjs&maxAge=3600" alt="discord.js version" /></a>

</p>
</div>

##  A Propos

**BlackHole** est un bot discord français open-source et libre d'utilisation permettant de protéger votre serveur discord des raids, spams et autres.
Il utilise les commandes slash et les commandes contextuelle.

##  Installation

**Node.js 16.6.0 ou version ultérieur nécéssaire.**

```sh-session

git clone https://github.com/AyrozDZN/BlackHole

npm i

npm start

```

##  Configuration


Fichier `config.js` qui se trouve dans le dossier config

```js

module.exports  = {

	emojis: {
		//nom: "mention de l'émoji <a:example:000000000000000000> ou <:example:000000000000000000>" 
	}, //Liste ici tout les émojis au quelle tu veut avoir accès rapidement dans tes embeds, il suffira d'utiliser client.emotes.nom pour afficher l'émoji.

	discord: {
		token: 'Entre le token de ton bot',
		color  : '#000000', //Couleur principale des embeds
		colorError  : '#000000', //Couleur d'erreur des embeds
		colorSuccess  : '#000000', //color de succès des embeds
		developer: 'Nom du/des développeurs', // Apparait dans le /botinfo
		footer: 'Texte du footer', //Texte qui apparait dans le footer
		link: 'https://exemple.fr'  //Lien qui apparait sur certain embeds
	}
};

```

Vous pourrez ensuite démarrer le bot avec la commande `npm start`

##  Links

- [Site](https://blackhole.net/)

- [GitHub](https://github.com/AyrozDZN/BlackHole)

- [Discord](https://discord.gg/rtPazUX)
