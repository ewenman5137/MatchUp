'use server'

import {cookies} from "next/headers";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";

//objet sur lequel faire les opérations
const requestCookies = await cookies();

/**
 * Ajoute un cookie, ou modifie sa valeur s'il existe déjà
 * @param cle la clé permettant de retrouver le cookie
 * @param valeur la valeur à stocker
 */
export const setItem = async (cle : string, valeur : string) => {
    let options : ResponseCookie = {
        name: cle,
        value: valeur,
        httpOnly: true, //Empêche le cookie d'être lu par du code JavaScript
        secure: true, //Le cookie ne sera envoyé que sur des connexions HTTPS
        sameSite: 'strict', //Le cookie ne sera envoyé que si la requête provient du même site
        maxAge: 3600, //Durée de vie du cookie en secondes
    }
    requestCookies.set(options);
}

/**
 * Récupère la valeur d'un cookie pour une clé donnée
 * @param cle la clé permettant de retrouver le cookie
 * @returns la valeur du cookie, ou null si le cookie n'existe pas pour la clé donnée
 */
export const getItem = async (cle : string) => {
    let resultat = requestCookies.get(cle);
    return resultat ? resultat.value : null;
}

/**
 * Vérifie si un cookie existe pour une clé donnée
 * @param cle la clé permettant de retrouver le cookie
 * @returns true si le cookie existe, false sinon
 */
export const hasItem = async (cle : string) => {
    return requestCookies.has(cle);
}

/**
 * Supprime un cookie pour une clé donnée
 * @param cle la clé permettant de retrouver le cookie
 */
export const deleteItem = async (cle : string) => {
    requestCookies.delete(cle);
}