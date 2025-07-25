// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Cars } from './collections/Cars'
import { Manufacturers } from './collections/Manufacturers'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Cars, Manufacturers],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [
          {
            slug: 'carHighlight',
            fields: [
              {
                name: 'car',
                type: 'relationship',
                relationTo: 'cars',
              },
              {
                name: 'type',
                type: 'radio',
                defaultValue: 'image',
                options: [
                  {
                    label: 'Image',
                    value: 'image',
                  },
                  {
                    label: 'Gallery',
                    value: 'gallery',
                  },
                ],
              },
            ],
          },
        ],
        inlineBlocks: [
          {
            slug: 'carPrice',
            admin: {
              components: {
                Label: '/components/CarPriceLabel',
              },
            },
            fields: [
              {
                name: 'car',
                type: 'relationship',
                relationTo: 'cars',
              },
              {
                name: 'price',
                type: 'number',
                required: true,
              },
            ],
          },
        ],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
