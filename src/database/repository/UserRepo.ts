import User, { UserModel } from '../model/User';
import { Types } from 'mongoose';

async function exists(id: Types.ObjectId): Promise<boolean> {
  const user = await UserModel.exists({ _id: id, status: true });
  return user !== null && user !== undefined;
}

async function findByEmail(email: string): Promise<User | null> {
  return UserModel.findOne({ email: email })
    .select(
      '+email +password +createdAt +updatedAt',
    )
    .lean()
    .exec();
}

async function findById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true })
    .select('+email +name')
    .lean()
    .exec();
}

async function create(
  user: User,
): Promise<{ user: User }> {
  const now = new Date();

  user.createdAt = user.updatedAt = now;
  const createdUser = await UserModel.create(user);
  return {
    user: { ...createdUser.toObject() },
  };
}

async function update(
  user: User,
): Promise<{ user: User }> {
  user.updatedAt = new Date();
  await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    .lean()
    .exec();
  return { user: user };
}

export default {
  exists,
  findById,
  findByEmail,
  create,
  update,
};
