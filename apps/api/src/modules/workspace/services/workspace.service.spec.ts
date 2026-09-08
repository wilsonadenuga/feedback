import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WorkspaceService } from './workspace.service';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { WORKSPACE_ROLES } from '@feedback/schema';

const DEFAULT_LABELS = ['Bug', 'Feature Request'];

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let repository: { create: jest.Mock };

  beforeEach(async () => {
    repository = {
      create: jest.fn().mockImplementation((data) => ({
        id: 'workspace-1',
        ...data,
        _count: { members: 1 },
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        { provide: WorkspaceRepository, useValue: repository },
        { provide: ConfigService, useValue: { get: () => DEFAULT_LABELS } },
      ],
    }).compile();

    service = module.get(WorkspaceService);
  });

  describe('create', () => {
    it('makes the workspace board-ready in one call', async () => {
      await service.create('user-1', { name: 'Acme Feedback' });

      const data = repository.create.mock.calls[0][0];

      // the workspace IS the board, so it needs a slug for its public URL
      expect(data.slug).toBe('acme-feedback');
      // labels hang off the workspace directly — there is no project step
      expect(data.labels.create).toEqual(
        DEFAULT_LABELS.map((name) => ({
          name,
          slug: expect.any(String),
          is_default: true,
        })),
      );
      // settings row is created up front so the board has defaults to read
      expect(data.settings).toEqual({ create: {} });
      expect(data.members.create).toEqual({
        user_id: 'user-1',
        role: WORKSPACE_ROLES.OWNER,
      });
    });

    it('does not create a project', async () => {
      await service.create('user-1', { name: 'Acme' });

      expect(repository.create.mock.calls[0][0]).not.toHaveProperty('projects');
    });

    it('exposes member_count instead of the raw _count', async () => {
      const workspace = await service.create('user-1', { name: 'Acme' });

      expect(workspace).toMatchObject({ member_count: 1 });
      expect(workspace).not.toHaveProperty('_count');
    });
  });
});
