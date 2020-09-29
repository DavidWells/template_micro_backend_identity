import { User } from "../../models/user";
import { signJWT, calculateExp } from "./crypto";
import { openid, profile, email, phone } from "../../types/openid-scopes";
import { UserService } from "../../services/user";
import { v4 as uuidv4 } from "uuid";
import { Unauthorized } from "../handlers/error-handling";

export async function generateTokens(dbUser: User): Promise<any> {
  
  const scopes_spaced = ['openid profile email phone'];
  const scopes = scopes_spaced[0].split(' ');

  const findOpenId = scopes.includes('openid');
  const findProfie = scopes.includes('profile');
  const findEmail = scopes.includes('email');
  const findPhone = scopes.includes('phone');


  if (!scopes) {
    throw new Unauthorized('No scopes specified in the grant type');
  }
  
  const tokenLink = uuidv4();

  // openid claims
  const openidClaims: openid = {
    sub: dbUser.user_id,
    iss: process.env.API_DOMAIN,
    aud: process.env.DOMAIN,
    iat: Math.floor(Date.now() / 1000),
    auth_time: Math.floor(Date.now() / 1000),
  };

  // profile claims
  const profileClaims: profile = {
    preferred_username: dbUser.preferred_username,
    given_name: dbUser.given_name,
    family_name: dbUser.family_name,
    address: dbUser.address,
    created_at: dbUser.created_at,
    locale: dbUser.locale,
    picture: dbUser.picture,
    birthdate: dbUser.birthdate,
    updated_at: dbUser.updated_at,
  };

  // email claims
  const emailClaims: email = {
    email: dbUser.email,
    email_verified: dbUser.email_verified
  };

  // phone claims
  const phoneClaims: phone = {
    phone_number: dbUser.phone_number,
    phone_number_verified: dbUser.phone_number_verified
  }

  // id token structure
  const idToken = {
    token_link: tokenLink,
    token_use: "id_token",
    exp: calculateExp("10h", openidClaims.iat),
  };

  const autoGeneratedScopes = await new UserService().getUserScopes(dbUser.user_id);

  const accessToken = {
    token_link: tokenLink,
    token_use: "access_token",
    exp: calculateExp("2h", openidClaims.iat),
    scopes: autoGeneratedScopes,
  };

  const refreshToken = {
    token_link: tokenLink,
    token_use: "refresh_token",
    exp: calculateExp("30d", openidClaims.iat),
  };

  if (findOpenId) {
    Object.assign(idToken, openidClaims);
    Object.assign(accessToken, openidClaims);
  }

  if (findProfie) {
    Object.assign(idToken, profileClaims);
    Object.assign(accessToken, profileClaims);
  }

  if (findEmail) {
    Object.assign(idToken, emailClaims);
    Object.assign(accessToken, emailClaims);
  }

  if (findPhone) {
    Object.assign(idToken, phoneClaims);
    Object.assign(accessToken, phoneClaims);
  }

  const signedIdToken = await signJWT(idToken);
  const signedAccessToken = await signJWT(accessToken);
  const signedRefreshToken = await signJWT(refreshToken);

  return {
    id_token: signedIdToken,
    access_token: signedAccessToken,
    refresh_token: signedRefreshToken,
    token_link: tokenLink,
  };
}