import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { CategoryModule } from "./category/category.module";
import { ExpenseModule } from "./expense/expense.module";
import { IncomeModule } from "./income/income.module";
import { ReportModule } from "./report/report.module";
import { SettingsModule } from "./settings/settings.module";
import { AssetTypeModule } from "./asset-type/asset-type.module";
import { AssetModule } from "./asset/asset.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ExpenseModule,
    IncomeModule,
    ReportModule,
    SettingsModule,
    AssetTypeModule,
    AssetModule,
  ],
})
export class AppModule {}
