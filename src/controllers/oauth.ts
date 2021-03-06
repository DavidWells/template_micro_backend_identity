
import { getAccessToken } from "../components/security/oauth-client";
import { Controller, Get, Post, Route, Tags, Query } from "tsoa";

@Route("oauth") // route name => localhost:xxx/SignUp
@Tags("Authorization - OAuth 2.0") // => Under SignUpController tag
export class OauthController extends Controller {   
    @Get("authorize") //specify the request type
    GetAuthorize(): any {
      return;
    }
    
    @Post("decision") //specify the request type
    async PostDecision(): Promise<any> {
      return;
    }

    @Post("token") //specify the request type
    async PostToken(): Promise<any> {
      return;
    }

    @Get("token_test") //specify the request type
    async GetTokenTest(): Promise<any> {
      const tokens = await getAccessToken();
      return tokens;
    }
}
