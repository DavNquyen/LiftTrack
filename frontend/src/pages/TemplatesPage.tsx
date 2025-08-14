import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Template, Exercise } from '../types';
import { PlusIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    exercises: [{ exerciseId: '', sets: 3, reps: 10, weight: 0 }]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [templatesRes, exercisesRes] = await Promise.all([
        api.get('/templates'),
        api.get('/exercises')
      ]);
      setTemplates(templatesRes.data);
      setExercises(exercisesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExerciseToTemplate = () => {
    setNewTemplate({
      ...newTemplate,
      exercises: [...newTemplate.exercises, { exerciseId: '', sets: 3, reps: 10, weight: 0 }]
    });
  };

  const removeExerciseFromTemplate = (index: number) => {
    setNewTemplate({
      ...newTemplate,
      exercises: newTemplate.exercises.filter((_, i) => i !== index)
    });
  };

  const updateTemplateExercise = (index: number, field: string, value: any) => {
    const updatedExercises = [...newTemplate.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setNewTemplate({ ...newTemplate, exercises: updatedExercises });
  };

  const saveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/templates', newTemplate);
      setTemplates([...templates, res.data]);
      setNewTemplate({
        name: '',
        description: '',
        exercises: [{ exerciseId: '', sets: 3, reps: 10, weight: 0 }]
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const useTemplate = async (templateId: string) => {
    try {
      const res = await api.post(`/templates/${templateId}/use`);
      alert('Template loaded! Go to Dashboard to start your workout.');
    } catch (error) {
      console.error('Error using template:', error);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await api.delete(`/templates/${templateId}`);
      setTemplates(templates.filter(t => t._id !== templateId));
      if (selectedTemplate?._id === templateId) {
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workout Templates</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Template
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Create New Template</h2>
            <form onSubmit={saveTemplate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercises
                  </label>
                  {newTemplate.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <select
                        required
                        value={exercise.exerciseId}
                        onChange={(e) => updateTemplateExercise(index, 'exerciseId', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select exercise</option>
                        {exercises.map(ex => (
                          <option key={ex._id} value={ex._id}>{ex.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Sets"
                        value={exercise.sets}
                        onChange={(e) => updateTemplateExercise(index, 'sets', parseInt(e.target.value))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={(e) => updateTemplateExercise(index, 'reps', parseInt(e.target.value))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Weight"
                        value={exercise.weight}
                        onChange={(e) => updateTemplateExercise(index, 'weight', parseFloat(e.target.value))}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeExerciseFromTemplate(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExerciseToTemplate}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add another exercise
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <div key={template._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => useTemplate(template._id)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                  title="Use template"
                >
                  <PlayIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteTemplate(template._id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Delete template"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            {template.description && (
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            )}
            <div className="space-y-1">
              {template.exercises.slice(0, 3).map((exercise, index) => (
                <div key={index} className="text-sm text-gray-700">
                  {(exercise.exerciseId as any)?.name} - {exercise.sets}×{exercise.reps}
                  {exercise.weight > 0 && ` @ ${exercise.weight}lbs`}
                </div>
              ))}
              {template.exercises.length > 3 && (
                <p className="text-sm text-gray-500">
                  +{template.exercises.length - 3} more exercises
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;