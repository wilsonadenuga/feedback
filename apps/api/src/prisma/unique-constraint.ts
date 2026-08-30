import { Prisma } from '../../generated/client/client';

function isArray(value: unknown): value is readonly unknown[] {
  return Array.isArray(value);
}

function readPath(source: unknown, ...path: string[]): unknown {
  return path.reduce<unknown>((value, key) => {
    if (typeof value !== 'object' || value === null) return undefined;
    return (value as Record<string, unknown>)[key];
  }, source);
}

/**
 * Under a driver adapter, which this app uses, Prisma leaves `meta.target`
 * empty and puts the columns on the driver error instead
 * (https://github.com/prisma/prisma/issues/28953). Both shapes are read so this
 * keeps working when that is fixed.
 */
export function uniqueConstraintColumns(error: unknown): string[] | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null;
  if (error.code !== 'P2002') return null;

  const fields = readPath(
    error.meta,
    'driverAdapterError',
    'cause',
    'constraint',
    'fields',
  );
  if (isArray(fields)) return fields.map(String);

  const target = error.meta?.target;
  if (isArray(target)) return target.map(String);
  if (typeof target === 'string') return [target];

  return null;
}

/**
 * Matches on columns because a nested write can violate any of several
 * constraints, and `meta.modelName` reports the top-level model for all of them
 * (https://github.com/prisma/prisma/issues/29595).
 */
export function violatesUnique(error: unknown, ...columns: string[]): boolean {
  if (columns.length === 0) return false;

  const violated = uniqueConstraintColumns(error);
  if (!violated || violated.length !== columns.length) return false;

  const sortedViolated = [...violated].sort();
  const sortedColumns = [...columns].sort();

  return sortedViolated.every(
    (column, index) => column === sortedColumns[index],
  );
}
