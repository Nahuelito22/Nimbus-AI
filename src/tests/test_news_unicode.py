from src.services.news_service import normalize_unicode

def test_normalize_basic():
    assert normalize_unicode("Hello") == "Hello"

    # e + combining acute (U+0301) vs precomposed 'é' (U+00E9)
    composed = "e\u0301"       # e + ´ (dos puntos: U+0301)
    precomposed = "é"          # U+00E9
    assert normalize_unicode(composed) == precomposed
    assert normalize_unicode(precomposed) == precomposed
        # acentos y ñ
    s1 = "n\u0303"   # n + ~  => ñ
    assert normalize_unicode(s1) == "ñ"

    # emoji (debería quedar igual)
    emoji = "👍"
    assert normalize_unicode(emoji) == emoji

    # si lo pasan no-str (ej: None) la función devuelve lo mismo
    assert normalize_unicode(None) is None
