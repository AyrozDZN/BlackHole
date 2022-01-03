const express = require("express");
const url = require("url");
const path = require("path");
const discord = require("discord.js");
const ejs = require("ejs");
const passport = require("passport");
const bodyParser = require("body-parser");
const Strategy = require("passport-discord").Strategy;
const config = require("../config/config");
const Settings = require("./settings.json");
const fs = require('fs')

module.exports = client => {
    //WEBSITE CONFIG BACKEND
    const app = express();
    const session = require("express-session");
    const MemoryStore = require("memorystore")(session);


    //Initalize the Discord Login
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((obj, done) => done(null, obj))
    passport.use(new Strategy({
        clientID: Settings.config.clientID,
        clientSecret: Settings.config.secret,
        callbackURL: Settings.config.callback,
        scope: ["identify", "guilds", "guilds.join", "email"]
    },
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(()=>done(null, profile))
    }
    ))

    app.use(session({
        store: new MemoryStore({checkPeriod: 86400000 }),
        secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
        resave: false,
        saveUninitialized: false
    }))

    // MIDDLEWARES 
    app.use(passport.initialize());
    app.use(passport.session());

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "./views"));


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    //Loading css files
    app.use(express.static(path.join(__dirname, '/public')));


    const checkAuth = (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    }
    app.get("/login", (req, res, next) => {
        if(req.session.backURL){
            req.session.backURL = req.session.backURL
        } else if(req.headers.referer){
            const parsed = url.parse(req.headers.referer);
            if(parsed.hostname == app.locals.domain){
                req.session.backURL = parsed.path
            }
        } else {
            req.session.backURL = "/"
        }
        next();
        }, passport.authenticate("discord", { prompt: "none"})
    );

    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
        let banned = false //client.settings.get("bannedusers")
        if(banned) {
            req.session.destroy()
            res.json({login: false, message: "You are banned from the dashboard", logout: true})
            req.logout();
        } else {
            console.log(req)
            res.redirect(req.session.backURL)
        }
    });

    app.get("/logout", function(req, res) {
        req.session.destroy(()=>{
            req.logout();
            res.redirect("/");
        })
    })

    app.get("/", (req, res) => {
        res.render("index", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            Permissions: discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.get("/serveur", checkAuth, async (req, res) => {
        if(!req.isAuthenticated() || !req.user)
        return res.redirect("/?error=" + encodeURIComponent("Login first please!"))
        if(!req.user.guilds)
        return res.redirect("/?error=" + encodeURIComponent("Cannot get your Guilds"))
        res.render("serveur", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            Permissions: discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.get("/serveur/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me before!"))
        let member = guild.members.cache.get(req.user.id);
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }
        if(!member)
        return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
        if(!member.permissions.has(discord.Permissions.FLAGS.MANAGE_GUILD))
        return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))
        res.render("settings", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.get("/serveur/:guildID/:fonction", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        const fonction = req.params.fonction
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me before!"))
        let member = guild.members.cache.get(req.user.id);
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }

        fonctionList = {
            "addbot": {
                categorie: "antiraid",
                nom: "addBot",
                dashMessage: "Configurer l'anti ajout de bot sur votre serveur"
            },
            "everyone": {
                categorie: "antiraid",
                nom: "everyone",
                dashMessage: "Configurer l'anti mention everyone sur votre serveur"
            },
            "link": {
                categorie: "antiraid",
                nom: "link",
                dashMessage: "Configurer l'anti liens sur votre serveur"
            },
            "spam": {
                categorie: "antiraid",
                nom: "spam",
                dashMessage: "Configurer l'anti-spam sur votre serveur"
            },
            "massban": {
                categorie: "antiraid",
                nom: "massBan",
                dashMessage: "Configurer l'anti ban en masse de votre serveur"
            },
            "masskick": {
                categorie: "antiraid",
                nom: "massKick",
                dashMessage: "Configurer l'anti kick en masse de votre serveur"
            },
            "webhook": {
                categorie: "antiraid",
                nom: "webhook",
                dashMessage: "Configurer l'anti webhook de votre serveur"
            },
            "channelcreate": {
                categorie: "antiraid",
                nom: "channelCreate",
                dashMessage: "Configurer l'anti création de salons de votre serveur"
            },
            "channeldelete": {
                categorie: "antiraid",
                nom: "channelDelete",
                dashMessage: "Configurer l'anti supression de salons de votre serveur"
            },
            "ban": {
                categorie: "moderation",
                nom: "ban",
                dashMessage: "Configurer la commande ban de votre serveur"
            },
            "kick": {
                categorie: "moderation",
                nom: "kick",
                dashMessage: "Configurer la commande kick de votre serveur"
            },
            "mute": {
                categorie: "moderation",
                nom: "mute",
                dashMessage: "Configurer la commande mute de votre serveur"
            },
            "warn": {
                categorie: "moderation",
                nom: "warn",
                dashMessage: "Configurer la commande warn de votre serveur"
            },
        }

        if(!member)
        return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
        if(!member.permissions.has(discord.Permissions.FLAGS.MANAGE_GUILD))
        return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))
        res.render("fonction", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            status: client.guildSettings[guild.id] ? client.guildSettings[guild.id][fonctionList[fonction].nom] ? client.guildSettings[guild.id][fonctionList[fonction].nom].status : false : false,
            whitelist: client.guildSettings[guild.id] ? client.guildSettings[guild.id][fonctionList[fonction].nom] ? client.guildSettings[guild.id][fonctionList[fonction].nom].whitelist : [] : [],
            times: client.guildSettings[guild.id] ? client.guildSettings[guild.id][fonctionList[fonction].nom] ? client.guildSettings[guild.id][fonctionList[fonction].nom].times : 0 : 0,
            duration: client.guildSettings[guild.id] ? client.guildSettings[guild.id][fonctionList[fonction].nom] ? client.guildSettings[guild.id][fonctionList[fonction].nom].duration / 1000 : 0 : 0,
            sanction: client.guildSettings[guild.id] ? client.guildSettings[guild.id][fonctionList[fonction].nom] ? client.guildSettings[guild.id][fonctionList[fonction].nom].sanction : "kick" : "kick",
            fonction: fonctionList[fonction],
            guild: guild,
            bot: client,
            Permissions: discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.get("/profil", checkAuth, async (req, res) => {
        if(!req.isAuthenticated() || !req.user)
        return res.redirect("/?error=" + encodeURIComponent("Login first please!"))
        if(!req.user.guilds)
        return res.redirect("/?error=" + encodeURIComponent("Cannot get your Guilds"))
        res.render("profil", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            Permissions: discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.post("/profil", checkAuth, async (req, res) => {
        console.log(req)
        if(!client.profiles[req.user.id]) client.profiles[req.user.id] = {
            description: ""
        }
        client.profiles[req.user.id].description = req.body.description
        fs.writeFileSync('./config/profiles.json', JSON.stringify(client.profiles, null, 4), err => {
            if (err) throw err;
        })
        res.render("profil", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            Permissions: discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.post("/serveur/:guildID/:fonction", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        const fonction = req.params.fonction
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me before!"))
        let member = guild.members.cache.get(req.user.id);
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }

        console.log(req.body)

        fonctionList = {
            "addbot": {
                categorie: "antiraid",
                nom: "addBot",
                dashMessage: "Configurer l'anti ajout de bot sur votre serveur"
            },
            "everyone": {
                categorie: "antiraid",
                nom: "everyone",
                dashMessage: "Configurer l'anti mention everyone sur votre serveur"
            },
            "link": {
                categorie: "antiraid",
                nom: "link",
                dashMessage: "Configurer l'anti liens sur votre serveur"
            },
            "spam": {
                categorie: "antiraid",
                nom: "spam",
                dashMessage: "Configurer l'anti-spam sur votre serveur"
            },
            "massban": {
                categorie: "antiraid",
                nom: "massBan",
                dashMessage: "Configurer l'anti ban en masse de votre serveur"
            },
            "masskick": {
                categorie: "antiraid",
                nom: "massKick",
                dashMessage: "Configurer l'anti kick en masse de votre serveur"
            },
            "webhook": {
                categorie: "antiraid",
                nom: "webhook",
                dashMessage: "Configurer l'anti webhook de votre serveur"
            },
            "channelcreate": {
                categorie: "antiraid",
                nom: "channelCreate",
                dashMessage: "Configurer l'anti création de salons de votre serveur"
            },
            "channeldelete": {
                categorie: "antiraid",
                nom: "channelDelete",
                dashMessage: "Configurer l'anti supression de salons de votre serveur"
            },
            "ban": {
                categorie: "moderation",
                nom: "ban",
                dashMessage: "Configurer la commande ban de votre serveur"
            },
            "kick": {
                categorie: "moderation",
                nom: "kick",
                dashMessage: "Configurer la commande kick de votre serveur"
            },
            "mute": {
                categorie: "moderation",
                nom: "mute",
                dashMessage: "Configurer la commande mute de votre serveur"
            },
            "warn": {
                categorie: "moderation",
                nom: "warn",
                dashMessage: "Configurer la commande warn de votre serveur"
            },
        }
        

        if (fonctionList[fonction].categorie == "antiraid") {
            if (req.body.switch) client.guildSettings[guild.id][fonctionList[fonction].nom].status = true
            else client.guildSettings[guild.id][fonctionList[fonction].nom].status = false

            if(req.body.roles) {
                if (typeof req.body.roles == "string") client.guildSettings[guild.id][fonctionList[fonction].nom].whitelist = [req.body.roles]
                else client.guildSettings[guild.id][fonctionList[fonction].nom].whitelist = req.body.roles
            } else client.guildSettings[guild.id][fonctionList[fonction].nom].whitelist = []

            if(req.body.sanction) client.guildSettings[guild.id][fonctionList[fonction].nom].sanction = req.body.sanction
            else client.guildSettings[guild.id][fonctionList[fonction].nom].sanction = "kick"

            if(req.body.times) client.guildSettings[guild.id][fonctionList[fonction].nom].times = req.body.times*1
            else client.guildSettings[guild.id][fonctionList[fonction].nom].times = 0

            if(req.body.duration) client.guildSettings[guild.id][fonctionList[fonction].nom].duration = req.body.duration*1000
            else client.guildSettings[guild.id][fonctionList[fonction].nom].duration = 0

            fs.writeFileSync('./config/guildSettings.json', JSON.stringify(client.guildSettings, null, 4), err => {
                if (err) throw err;
            })
        } else {

        }

        res.render("fonction", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            status: client.guildSettings[guild.id] ? client.guildSettings[guild.id][fonctionList[fonction].nom] ? client.guildSettings[guild.id][fonctionList[fonction].nom].status : false : false,
            whitelist: client.guildSettings[guild.id] ? client.guildSettings[guild.id][fonctionList[fonction].nom] ? client.guildSettings[guild.id][fonctionList[fonction].nom].whitelist : [] : [],
            times: client.guildSettings[guild.id] ? client.guildSettings[guild.id][fonctionList[fonction].nom] ? client.guildSettings[guild.id][fonctionList[fonction].nom].times : 0 : 0,
            duration: client.guildSettings[guild.id] ? client.guildSettings[guild.id][fonctionList[fonction].nom] ? client.guildSettings[guild.id][fonctionList[fonction].nom].duration / 1000 : 0 : 0,
            sanction: client.guildSettings[guild.id] ? client.guildSettings[guild.id][fonctionList[fonction].nom] ? client.guildSettings[guild.id][fonctionList[fonction].nom].sanction : "kick" : "kick",
            fonction: fonctionList[fonction],
            guild: guild,
            bot: client,
            Permissions: discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    const http = require("http").createServer(app);
    http.listen(Settings.config.port, () => {
        console.log(`Website is online on the Port: ${Settings.config.port}`);
    });

}