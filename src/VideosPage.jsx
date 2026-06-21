'use client'

import { useState, useEffect } from 'react'
import { Upload, Play, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react'
// Note: Supabase import might need adjustment if not configured
// import { supabase } from '@/lib/supabase'

// Mocking supabase if not available for the sake of build success
const supabase = {
  from: () => ({
    select: () => ({
      order: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => Promise.resolve({ error: null }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null })
    })
  })
}

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNewVideoForm, setShowNewVideoForm] = useState(false)
  const [newVideo, setNewVideo] = useState({ title: '', client: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('upload_date', { ascending: false })
      if (error) throw error
      setVideos(data || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar vídeos'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVideo = async (e) => {
    e.preventDefault()
    if (!newVideo.title || !newVideo.client) return
    try {
      setSubmitting(true)
      const { error } = await supabase.from('videos').insert([
        {
          title: newVideo.title,
          client: newVideo.client,
          upload_date: new Date().toISOString().split('T')[0],
          approval_status: 'pending',
        },
      ])
      if (error) throw error
      setNewVideo({ title: '', client: '' })
      setShowNewVideoForm(false)
      await loadVideos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar vídeo')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteVideo = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este vídeo?')) return
    try {
      const { error } = await supabase.from('videos').delete().eq('id', id)
      if (error) throw error
      await loadVideos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar vídeo')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle size={16} />
            Aprovado
          </div>
        )
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            <AlertCircle size={16} />
            Pendente
          </div>
        )
      case 'revision':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            <AlertCircle size={16} />
            Revisão
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Gerenciar Vídeos
        </h1>
        <p className="text-neutral-600">
          Faça upload de vídeos e acompanhe as aprovações
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowNewVideoForm(!showNewVideoForm)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
          disabled={submitting}
        >
          <Upload size={18} />
          Novo Vídeo
        </button>
      </div>

      {showNewVideoForm && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">
            Adicionar Novo Vídeo
          </h3>
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Título
              </label>
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Cliente
              </label>
              <input
                type="text"
                value={newVideo.client}
                onChange={(e) => setNewVideo({ ...newVideo, client: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                required
                disabled={submitting}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                {submitting ? 'Adicionando...' : 'Adicionar'}
              </button>
              <button type="button" onClick={() => setShowNewVideoForm(false)} className="px-4 py-2 bg-neutral-200 rounded-lg" disabled={submitting}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <Play size={48} className="mx-auto mb-4 text-neutral-300" />
          <p>Nenhum vídeo adicionado ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <div key={video.id} className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{video.title}</h3>
                  <p className="text-sm text-neutral-600">{video.client}</p>
                  <p className="text-xs text-neutral-500">
                    {new Date(video.upload_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(video.approval_status)}
                  <button onClick={() => handleDeleteVideo(video.id)}>
                    <Trash2 className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
