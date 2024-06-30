// src/components/Feed.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  name: string;
  body: string;
}

interface PostFormInputs {
  title: string;
  body: string;
}

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f2f5;
`;

const PostCard = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  margin: 20px 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const PostContent = styled.div`
  margin-bottom: 10px;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentSection = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-top: 1px solid #ddd;
`;

const PostForm = styled.form`
  width: 100%;
  max-width: 600px;
  margin: 20px 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
`;

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  body: yup.string().required('Body is required'),
});

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [displayComments, setDisplayComments] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PostFormInputs>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const fetchComments = (postId: number) => {
    axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then(response => {
        setComments(response.data);
        setSelectedPostId(postId);
        setDisplayComments(true);
      })
      .catch(error => console.error('Error fetching comments:', error));
  };

  const onSubmit: SubmitHandler<PostFormInputs> = data => {
    axios.post('https://jsonplaceholder.typicode.com/posts', data)
      .then(response => {
        setPosts([response.data, ...posts]);
        reset();
      })
      .catch(error => console.error('Error creating post:', error));
  };

  return (
    <FeedContainer>
      <PostForm as={motion.form} onSubmit={handleSubmit(onSubmit)}>
        <h2>Create a Post</h2>
        <div className="p-field">
          <label htmlFor="title">Title</label>
          <InputText id="title" {...register('title')} className={`p-inputtext ${errors.title ? 'p-invalid' : ''}`} />
          {errors.title && <small className="p-error">{errors.title.message}</small>}
        </div>
        <div className="p-field">
          <label htmlFor="body">Body</label>
          <InputTextarea id="body" {...register('body')} className={`p-inputtextarea ${errors.body ? 'p-invalid' : ''}`} rows={3} />
          {errors.body && <small className="p-error">{errors.body.message}</small>}
        </div>
        <Button type="submit" label="Create Post" className="p-button-success" />
      </PostForm>

      {posts.map(post => (
        <PostCard
          key={post.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PostHeader>
            <Avatar label="U" shape="circle" size="large" style={{ marginRight: '10px' }} />
            <div>
              <strong>Username</strong>
              <p style={{ margin: 0, color: '#888' }}>Post ID: {post.id}</p>
            </div>
          </PostHeader>
          <PostContent>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </PostContent>
          <PostFooter>
            <Button label="Like" className="p-button-secondary" />
            <Button label="Comment" className="p-button-secondary" onClick={() => fetchComments(post.id)} />
            <Button label="Share" className="p-button-secondary" />
          </PostFooter>
        </PostCard>
      ))}

      <Dialog header="Comments" visible={displayComments} style={{ width: '50vw' }} onHide={() => setDisplayComments(false)}>
        <CommentSection>
          {comments.map(comment => (
            <div key={comment.id}>
              <h4>{comment.name}</h4>
              <p>{comment.body}</p>
            </div>
          ))}
        </CommentSection>
      </Dialog>
    </FeedContainer>
  );
};

export default Feed;
