import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
  ) {}

  create(data: Partial<Item>) {
    return new this.itemModel(data).save();
  }

  findAll() {
    return this.itemModel.find().exec();
  }

  findOne(id: string) {
    return this.itemModel.findById(id).exec();
  }

  update(id: string, data: Partial<Item>) {
    return this.itemModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.itemModel.findByIdAndDelete(id).exec();
  }
}