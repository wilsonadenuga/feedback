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
