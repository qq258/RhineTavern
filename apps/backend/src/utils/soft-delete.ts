export const softDelete = async <T extends { update: Function }>(
  model: T,
  args: { where: any; data?: any }
): Promise<any> => {
  return model.update({
    where: args.where,
    data: { deleted: true, deletedDate: new Date(), ...args.data },
  });
};

export const addDeletedFilter = (where: any = {}): any => {
  return { ...where, deleted: false };
};