import { Module } from "@nestjs/common";
import { AssetTypeService } from "./asset-type.service";
import { AssetTypeResolver } from "./asset-type.resolver";

@Module({
  providers: [AssetTypeService, AssetTypeResolver],
  exports: [AssetTypeService],
})
export class AssetTypeModule {}
