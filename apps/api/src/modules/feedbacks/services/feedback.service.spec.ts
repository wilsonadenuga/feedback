import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { FEEDBACK_STATUSES } from '@feedback/schema';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let repository: {
    create: jest.Mock;
    findMany: jest.Mock;
    findById: jest.Mock;
    updateStatus: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn().mockImplementation((data) => data),
      findMany: jest.fn().mockResolvedValue({ feedbacks: [], total: 0 }),
      findById: jest.fn().mockResolvedValue({ id: 'feedback-1' }),
      updateStatus: jest.fn().mockImplementation((id, status) => ({
        id,
        status,
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        { provide: FeedbackRepository, useValue: repository },
      ],
    }).compile();

    service = module.get(FeedbackService);
  });

  describe('create', () => {
    it('scopes to the workspace and attributes the author', async () => {
      await service.create('user-1', {
        workspace_id: 'workspace-1',
        title: 'Dark mode',
      });

      const data = repository.create.mock.calls[0][0];

      expect(data.workspace).toEqual({ connect: { id: 'workspace-1' } });
      // author is required — there are no guest submissions
      expect(data.author).toEqual({ connect: { id: 'user-1' } });
      expect(data).not.toHaveProperty('project');
    });

    it('attaches labels through FeedbackLabel when label_ids are given', async () => {
      await service.create('user-1', {
        workspace_id: 'workspace-1',
        title: 'Dark mode',
        label_ids: ['label-1', 'label-2'],
      });

      expect(repository.create.mock.calls[0][0].labels).toEqual({
        create: [
          { label: { connect: { id: 'label-1' } } },
          { label: { connect: { id: 'label-2' } } },
        ],
      });
    });

    it('omits the labels relation when none are given', async () => {
      await service.create('user-1', {
        workspace_id: 'workspace-1',
        title: 'Dark mode',
      });

      expect(repository.create.mock.calls[0][0]).not.toHaveProperty('labels');
    });
  });

  describe('findMany', () => {
    it('filters by workspace, and by label through the join table', async () => {
      await service.findMany({
        workspace_id: 'workspace-1',
        label_id: 'label-1',
        page: 1,
        limit: 10,
        sort_order: 'desc',
      });

      const where = repository.findMany.mock.calls[0][0];

      expect(where.workspace_id).toBe('workspace-1');
      expect(where.labels).toEqual({ some: { label_id: 'label-1' } });
      expect(where).not.toHaveProperty('project_id');
    });

    it('searches title and description only', async () => {
      await service.findMany({
        workspace_id: 'workspace-1',
        search: 'dark',
        page: 1,
        limit: 10,
        sort_order: 'desc',
      });

      // the customer_* columns are gone, so they cannot be searched
      expect(repository.findMany.mock.calls[0][0].OR).toEqual([
        { title: { contains: 'dark', mode: 'insensitive' } },
        { description: { contains: 'dark', mode: 'insensitive' } },
      ]);
    });
  });

  describe('updateStatus', () => {
    it('passes the new status through to the repository', async () => {
      const result = await service.updateStatus('feedback-1', {
        status: FEEDBACK_STATUSES.PLANNED,
      });

      expect(repository.updateStatus).toHaveBeenCalledWith(
        'feedback-1',
        FEEDBACK_STATUSES.PLANNED,
      );
      expect(result).toMatchObject({ status: FEEDBACK_STATUSES.PLANNED });
    });
  });
});
