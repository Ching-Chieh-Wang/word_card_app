import { z } from 'zod';
import { LabelsSchema } from '@/types/label/label';
import { ApiHelper } from '../ApiHelper';
import { API } from '@/types/API';
import { ParseHelper } from '@/utils/ParseHelper';
import { ErrorHandle } from '../../utils/ErrorHandle';
import { PublicWordSchema } from '@/types/word/publicWord';
import { PublicCollectionSchema } from '@/types/collection/publicCollection';

const responseWordSchema = PublicWordSchema.extend({
  label_ids:z.array(z.number())
})

const responseWordsSchema=z.record(responseWordSchema);

const responseSchema = z.object({
  name: z.string(),
  words: responseWordsSchema,
  labels: LabelsSchema,
});

export const fetchPublicCollectionRequest = async (collection_id) => {
  const url = `/api/collections/${collection_id}`;
  const [data, error1] = await ApiHelper(url, API.GET, null, null, responseSchema, 'load collection');
  if (error1) return [data, "Failed to load collection"];

  const words = Object.fromEntries(
    Object.entries(data.words).map(([id, word]) => [
      id,
      {
        ...word,
        label_ids: new Set(word.label_ids),
      }
    ])
  );

  const [collection, error2 ] = ParseHelper(PublicCollectionSchema, {
    ...data,
    id: collection_id,
    originalWords: words,
    words: Object.values(words)
  });
  if(error2) {
    ErrorHandle(`Failed to load collection, please try again later!`);
    return [null, "Failed to load collection"];
  }
  return [collection, null];
}