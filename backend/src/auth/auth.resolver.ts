import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthPayload } from "./models/auth.model";
import { RegisterInput, LoginInput } from "./dto/auth.input";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(
    @Args("input") registerInput: RegisterInput,
  ): Promise<AuthPayload> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthPayload)
  async login(@Args("input") loginInput: LoginInput): Promise<AuthPayload> {
    return this.authService.login(loginInput);
  }
}
