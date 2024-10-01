export function generateChapterSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[#'"]/g, '') // Remove caracteres indesejados
    .replace(/[\s\-]+/g, '-') // Substitui espaços e hífens por um único hífen
    .normalize('NFD') // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9-]/g, '') // Remove qualquer caractere restante que não seja letra, número ou hífen
    .replace(/--+/g, '-') // Substitui múltiplos hífens por um único
    .trim(); // Remove espaços extras no início e no fim
}
